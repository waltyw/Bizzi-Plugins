const buckets = new Map<string, { count: number; reset: number }>();

/** Simple fixed-window in-memory limiter. Returns true when the request is allowed. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
  }
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}

export function clientIp(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for');
  const ip = fwd ? fwd.split(',')[0].trim() : headers.get('x-real-ip') ?? 'unknown';
  return ip.slice(0, 64);
}
