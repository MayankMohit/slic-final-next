import { MongoClient, type Db, type MongoClientOptions } from "mongodb";

/**
 * A single MongoClient, cached across invocations.
 *
 * Serverless functions are frozen and thawed rather than torn down, so a client
 * created at module scope survives between requests on the same instance. What
 * does NOT survive is a new client per request: each one opens its own pool,
 * and Atlas' connection cap is reached long before the traffic justifies it.
 *
 * In development the cache is hung off globalThis because Turbopack discards
 * and re-evaluates modules on every edit, which would otherwise leak a fresh
 * pool per hot reload until Atlas starts refusing connections.
 */

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "slic";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

const options: MongoClientOptions = {
  /**
   * Eight seconds instead of the 30-second default.
   *
   * When the cluster is genuinely unreachable — a VPN that filters port 27017
   * is the usual culprit locally — the default makes every page load hang for
   * half a minute before surfacing the error, which is miserable to debug
   * against. Eight seconds is still far more than a healthy Atlas connection
   * needs (a warm one selects a server in well under a second) but turns a
   * dead database into a fast, obvious failure.
   */
  serverSelectionTimeoutMS: 8000,
};

function connect(): Promise<MongoClient> {
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (see README) before using the blog.",
    );
  }

  const isDev = process.env.NODE_ENV === "development";

  const cached = isDev ? global._mongoClientPromise : clientPromise;
  if (cached) return cached;

  const promise = new MongoClient(uri, options).connect();

  /**
   * Uncache the promise if it rejects.
   *
   * This is the whole reason connect() is not a one-line `??=`. A cached
   * *promise* that settled as rejected stays rejected forever, so every later
   * request replays the original failure even after the cluster becomes
   * reachable again — one transient outage, or a VPN that was filtering port
   * 27017 when the server started, would need a full restart to clear.
   * Dropping the entry lets the next request build a fresh client.
   *
   * The handler also marks the rejection as observed, which is what keeps Node
   * from logging it as an unhandled rejection. Callers still receive the
   * original error, because `promise` is what gets returned, not this chain.
   */
  promise.catch(() => {
    if (isDev) global._mongoClientPromise = undefined;
    else clientPromise = undefined;
  });

  if (isDev) global._mongoClientPromise = promise;
  else clientPromise = promise;

  return promise;
}

export async function getDb(): Promise<Db> {
  const client = await connect();
  return client.db(dbName);
}

/**
 * True when a connection string is configured at all.
 *
 * `next build` prerenders /blog and /sitemap.xml, and a CI or preview build
 * without MONGODB_URI would fail the whole build rather than just shipping an
 * empty blog. Callers use this to degrade to "no posts yet" instead of
 * throwing.
 */
export const isDbConfigured = Boolean(uri);
