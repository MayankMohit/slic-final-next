import "server-only";
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies, headers } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getDb } from "./mongodb";

/**
 * Admin authentication for /admin.
 *
 * One shared password. The hash lives in Mongo so the password can be changed
 * from the admin UI without a redeploy; ADMIN_PASSWORD_HASH is only the
 * bootstrap credential, used until someone sets a password for the first time.
 * After that the environment variable is ignored entirely.
 *
 * Generate the bootstrap value with:
 *   node scripts/hash-password.mjs "your password"
 */

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;
const COOKIE_NAME = "slic_admin";
const SESSION_DAYS = 7;

/** Anything shorter is not worth the ceremony of hashing it. */
export const MIN_PASSWORD_LENGTH = 12;

/* -------------------------------------------------------------------------- */
/* Stored settings                                                            */
/* -------------------------------------------------------------------------- */

interface AdminSettings {
  _id: "admin";
  passwordHash: string;
  /**
   * When the password last changed.
   *
   * Sessions issued before this instant are refused, so changing the password
   * signs out every other device. Without it, someone who had already logged in
   * would keep their access after the credential was rotated away from them -
   * which is usually the exact reason the password is being changed.
   */
  passwordChangedAt: Date;
}

async function settingsCollection() {
  const db = await getDb();
  return db.collection<AdminSettings>("admin_settings");
}

/**
 * Reads the stored credential.
 *
 * Deliberately not wrapped in a try/catch. If Mongo is unreachable we must not
 * quietly fall back to ADMIN_PASSWORD_HASH: that variable may hold a password
 * the client has since rotated away, so treating a database outage as "use the
 * old credential" would resurrect it. Callers turn the throw into a locked door.
 */
async function readSettings() {
  return (await settingsCollection()).findOne({ _id: "admin" });
}

/* -------------------------------------------------------------------------- */
/* Password                                                                   */
/* -------------------------------------------------------------------------- */

/** Hash format written here and by scripts/hash-password.mjs. */
export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, KEY_LENGTH);
  return `scrypt:${salt.toString("hex")}:${key.toString("hex")}`;
}

async function matches(password: string, stored: string | undefined) {
  if (!stored) return false;

  const [scheme, saltHex, keyHex] = stored.split(":");
  if (scheme !== "scrypt" || !saltHex || !keyHex) return false;

  const expected = Buffer.from(keyHex, "hex");
  if (expected.length !== KEY_LENGTH) return false;

  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), KEY_LENGTH);
  // Constant-time: a plain === leaks how many leading bytes matched.
  return timingSafeEqual(actual, expected);
}

export async function verifyPassword(password: string) {
  const settings = await readSettings();
  // The env var is the bootstrap only. Once a password has been set in the UI,
  // the stored hash is the single source of truth.
  return matches(password, settings?.passwordHash ?? process.env.ADMIN_PASSWORD_HASH);
}

/** True once a password has been set through the UI. */
export async function hasStoredPassword() {
  return Boolean((await readSettings())?.passwordHash);
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
    // iat is what the passwordChangedAt check below compares against.
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

/** True when the caller holds a valid, unexpired, un-revoked admin session. */
export async function isAuthenticated() {
  const secret = sessionSecret();
  if (!secret) return false;

  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    if (payload.role !== "admin") return false;

    // Revoked by a password change. jose already rejected anything expired or
    // tampered with; this is the one condition it cannot know about.
    const settings = await readSettings();
    if (settings?.passwordChangedAt && typeof payload.iat === "number") {
      const changedAt = Math.floor(settings.passwordChangedAt.getTime() / 1000);
      if (payload.iat < changedAt) return false;
    }

    return true;
  } catch {
    // Expired, tampered with, signed under a rotated secret, or the database
    // is unreachable. All of them mean "not logged in".
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

/**
 * Replaces the password and revokes every existing session.
 *
 * The current password is required even though the caller already holds a valid
 * session: without it, a borrowed laptop or a stolen cookie converts into
 * permanent ownership of the account.
 */
export async function changeAdminPassword(current: string, next: string) {
  if (!(await verifyPassword(current))) {
    return { ok: false as const, error: "That is not the current password." };
  }
  if (next.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false as const,
      error: `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }
  if (next === current) {
    return { ok: false as const, error: "That is already the current password." };
  }

  const collection = await settingsCollection();
  await collection.updateOne(
    { _id: "admin" },
    { $set: { passwordHash: await hashPassword(next), passwordChangedAt: new Date() } },
    { upsert: true },
  );

  return { ok: true as const };
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
 * Counts a credential attempt and reports whether this client is locked out.
 *
 * Kept in Mongo rather than in lib/rate-limit.ts because that limiter is
 * per-instance memory: on Vercel a brute force spread across warm instances
 * gets `max` tries per instance. Password guessing is exactly the case where
 * that distinction matters.
 *
 * `scope` separates the login form from the change-password form so a locked
 * out guesser cannot also lock the real admin out of rotating their password.
 */
export async function registerLoginAttempt(ip: string, scope = "login") {
  const collection = await attemptsCollection();
  const result = await collection.findOneAndUpdate(
    { _id: `${scope}:${ip}` },
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

/** Clears the counter so a successful attempt doesn't spend the window. */
export async function clearLoginAttempts(ip: string, scope = "login") {
  const collection = await attemptsCollection();
  await collection.deleteOne({ _id: `${scope}:${ip}` });
}
