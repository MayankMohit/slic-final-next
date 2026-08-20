/**
 * Generates the two admin env values.
 *
 *   node scripts/hash-password.mjs "the password you want"
 *
 * Prints ADMIN_PASSWORD_HASH and a fresh ADMIN_SESSION_SECRET. Paste both into
 * .env.local and into the Vercel project settings. Rotating the session secret
 * invalidates every existing login, which is the fastest way to lock everyone
 * out if the password ever leaks.
 */
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb);
const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-password.mjs <password>");
  process.exit(1);
}

if (password.length < 12) {
  console.error(
    "Use at least 12 characters - this is the only credential guarding /admin.",
  );
  process.exit(1);
}

const salt = randomBytes(16);
const key = await scrypt(password, salt, 64);

console.log("");
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString("hex")}:${key.toString("hex")}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(48).toString("base64url")}`);
console.log("");
