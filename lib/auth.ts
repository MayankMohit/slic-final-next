import "server-only";
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies, headers } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getDb } from "./mongodb";

/**
 * Admin authentication for /admin.
 *
 * One shared password, stored only as a scrypt hash in ADMIN_PASSWORD_HASH, and
 * a signed session cookie. There is no user collection by design: the site has
 * a single editor. If that changes, this is the file to grow.
 *
 * Generate the hash with:  node scripts/hash-password.mjs "your password"
 */

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;
const COOKIE_NAME = "slic_admin";
const SESSION_DAYS = 7;

/* -------------------------------------------------------------------------- */
/* Password                                                                   */
/* -------------------------------------------------------------------------- */

/** Hash format written by scripts/hash-password.mjs. */
export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, KEY_LENGTH);
  return `scrypt:${salt.toString("hex")}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string) {
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!stored) return false;

  const [scheme, saltHex, keyHex] = stored.split(":");
  if (scheme !== "scrypt" || !saltHex || !keyHex) return false;

  const expected = Buffer.from(keyHex, "hex");
  if (expected.length !== KEY_LENGTH) return false;

  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), KEY_LENGTH);
  // Constant-time: a plain === leaks how many leading bytes matched.
  return timingSafeEqual(actual, expected);
}

/* -------------------------------------------------------------------------- */
/* Session                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Fails closed. An unset or short secret means no session can be minted and no
 * session can be verified, so a misconfigured deploy locks the admin out rather
 * than leaving it signed with a guessable key.
 */
function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export async function startSession() {
  const secret = sessionSecret();
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set (needs 32+ characters)");
  }

  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret);

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    // Lax rather than strict so following a link into /admin from an email or
    // from the site itself keeps you logged in; the cookie is withheld from
    // cross-site POSTs either way.
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** True when the caller holds a valid, unexpired admin session. */
export async function isAuthenticated() {
  const secret = sessionSecret();
  if (!secret) return false;

  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return payload.role === "admin";
  } catch {
    // Expired, tampered with, or signed under a rotated secret.
    return false;
  }
}

/**
 * The authorisation check every mutating path must call.
 *
 * Deliberately not delegated to middleware: middleware runs ahead of the route,
 * has been bypassable in the past, and does not cover server actions at all.
 * Each action and route handler asserts for itself, so the guard travels with
 * the code that does the damage.
 */
export async function assertAdmin() {
  if (!(await isAuthenticated())) throw new Error("Not authorised");
}

/* -------------------------------------------------------------------------- */
/* Login throttling                                                           */
/* -------------------------------------------------------------------------- */

interface LoginAttempt {
  _id: string;
  count: number;
  expiresAt: Date;
}

const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

let ttlIndexReady: Promise<unknown> | undefined;

async function attemptsCollection() {
  const db = await getDb();
  const collection = db.collection<LoginAttempt>("login_attempts");
  // expireAfterSeconds 0 means "delete once expiresAt passes". Mongo sweeps
  // about once a minute, so a window lapses slightly late rather than early.
  ttlIndexReady ??= collection.createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 },
  );
  await ttlIndexReady;
  return collection;
}

/** The client IP, read from request headers inside a server action. */
export async function requestIp() {
  const store = await headers();
  const forwarded = store.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return store.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Counts a login attempt and reports whether this client is locked out.
 *
 * Kept in Mongo rather than in lib/rate-limit.ts because that limiter is
 * per-instance memory: on Vercel a brute force spread across warm instances
 * gets `max` tries per instance. Password guessing is exactly the case where
 * that distinction matters.
 */
export async function registerLoginAttempt(ip: string) {
  const collection = await attemptsCollection();
  const result = await collection.findOneAndUpdate(
    { _id: `login:${ip}` },
    {
      $inc: { count: 1 },
      $setOnInsert: { expiresAt: new Date(Date.now() + WINDOW_MS) },
    },
    { upsert: true, returnDocument: "after" },
  );

  const count = result?.count ?? 1;
  return {
    ok: count <= MAX_ATTEMPTS,
    retryAfterMinutes: Math.ceil(WINDOW_MS / 60000),
  };
}

/** Clears the counter so a successful login doesn't spend the window. */
export async function clearLoginAttempts(ip: string) {
  const collection = await attemptsCollection();
  await collection.deleteOne({ _id: `login:${ip}` });
}
