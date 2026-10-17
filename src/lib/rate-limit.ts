/**
 * Tiny in-memory fixed-window rate limiter. Good enough to blunt form spam on
 * a single serverless instance; swap for a shared store if traffic warrants.
 */
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** Returns null when allowed, or the number of seconds to wait. */
export function rateLimit(
  req: Request,
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): number | null {
  const now = Date.now();
  const id = `${key}:${clientIp(req)}`;
  const b = buckets.get(id);

  if (!b || b.resetAt <= now) {
    buckets.set(id, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    }
    return null;
  }
  if (b.count >= limit) return Math.ceil((b.resetAt - now) / 1000);
  b.count += 1;
  return null;
}
