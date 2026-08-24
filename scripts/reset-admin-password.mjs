/**
 * Resets the /admin password when it has been forgotten.
 *
 *   node --env-file=.env.local scripts/reset-admin-password.mjs "the new password"
 *
 * Point --env-file at whichever environment you mean to change. MONGODB_URI is
 * the only variable that matters here, and it is what decides whether you are
 * resetting production or your local database. To be certain you have the
 * production connection string, pull it rather than assuming .env.local holds
 * it - `vercel env pull` defaults to Development, so the flag is not optional:
 *
 *   vercel env pull --environment=production .env.production.local
 *   node --env-file=.env.production.local scripts/reset-admin-password.mjs "..."
 *
 * Delete that file afterwards. It holds every production secret, including the
 * Resend key, and .gitignore only saves you from committing it.
 *
 * ---------------------------------------------------------------------------
 * Why this exists rather than "edit ADMIN_PASSWORD_HASH in Vercel"
 *
 * That variable is the bootstrap credential only. lib/auth.ts reads the hash
 * from the admin_settings document in Mongo and falls back to the environment
 * variable *only when no document exists*:
 *
 *   matches(password, settings?.passwordHash ?? process.env.ADMIN_PASSWORD_HASH)
 *
 * So the moment anyone sets a password through /admin/settings, the environment
 * variable stops being consulted. Changing it in Vercel and redeploying looks
 * like it should work, does nothing at all, and costs you a deploy to find out.
 * The stored document is the thing that has to change.
 * ---------------------------------------------------------------------------
 *
 * Writing passwordChangedAt also signs out every existing session, because
 * isAuthenticated() refuses any token issued before it. That is the behaviour
 * you want during a reset: you do not know who still holds a valid cookie.
 */
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { promisify } from "node:util";
import { MongoClient } from "mongodb";

const scrypt = promisify(scryptCb);

// Both must match lib/auth.ts. They are restated rather than imported because
// that module is TypeScript and carries "server-only", which throws outside a
// React server context.
const KEY_LENGTH = 64;
const MIN_PASSWORD_LENGTH = 12;

const password = process.argv[2];
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "slic";

if (!password) {
  console.error(
    'Usage: node --env-file=.env.local scripts/reset-admin-password.mjs "<new password>"',
  );
  process.exit(1);
}

if (password.length < MIN_PASSWORD_LENGTH) {
  console.error(
    `Use at least ${MIN_PASSWORD_LENGTH} characters - this is the only credential guarding /admin.`,
  );
  process.exit(1);
}

if (!uri) {
  console.error(
    "MONGODB_URI is not set. Run with: node --env-file=.env.local scripts/reset-admin-password.mjs \"<new password>\"",
  );
  process.exit(1);
}

// Which cluster is about to be changed, with the credentials stripped. Resetting
// the wrong environment's password is the obvious way to waste an afternoon.
const target = uri.replace(/\/\/[^@]*@/, "//");
console.log(`\nCluster:  ${target}`);
console.log(`Database: ${dbName}`);

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });

try {
  await client.connect();
  const collection = client.db(dbName).collection("admin_settings");

  const existing = await collection.findOne({ _id: "admin" });

  const salt = randomBytes(16);
  const key = await scrypt(password, salt, KEY_LENGTH);
  const passwordHash = `scrypt:${salt.toString("hex")}:${key.toString("hex")}`;

  await collection.updateOne(
    { _id: "admin" },
    { $set: { passwordHash, passwordChangedAt: new Date() } },
    { upsert: true },
  );

  console.log(
    existing
      ? "\nPassword replaced. Every existing admin session is now signed out."
      : "\nPassword set for the first time. ADMIN_PASSWORD_HASH is no longer consulted.",
  );
  console.log("Sign in at /admin/login with the new password.\n");

  // Keeping the bootstrap value in step matters for one case: if the
  // admin_settings document is ever dropped, the environment variable becomes
  // live again, and a stale one would resurrect a password that was rotated
  // away. Optional, but it costs one paste.
  console.log("Optional, to keep the bootstrap value in step - set in Vercel:");
  console.log(`ADMIN_PASSWORD_HASH=${passwordHash}\n`);
} finally {
  await client.close();
}
