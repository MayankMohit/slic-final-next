/**
 * Fixed-window in-memory rate limiter.
 *
 * Scope note: serverless instances don't share memory, so the effective limit
 * is `max` per instance per window rather than a global cap. That is enough to
 * stop a single client hammering the form (which costs real money in Resend
 * quota and floods the inbox); it is not a defence against a distributed flood.
 * Move to Upstash/Vercel KV if that ever becomes the threat model.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

// Bound the map so a spray of unique IPs can't grow it without limit.
const MAX_TRACKED_KEYS = 10_000;

export function rateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number },
): { ok: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    if (buckets.size >= MAX_TRACKED_KEYS) {
      for (const [k, v] of buckets) {
        if (now >= v.resetAt) buckets.delete(k);
      }
      if (buckets.size >= MAX_TRACKED_KEYS) buckets.clear();
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  if (existing.count > max) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }
  return { ok: true, retryAfterSeconds: 0 };
}

/**
 * Vercel sets x-forwarded-for and it cannot be spoofed past the edge, so the
 * first entry is the real client. Falls back to a shared bucket locally.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
