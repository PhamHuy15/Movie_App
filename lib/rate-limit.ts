interface Bucket {
    count: number;
    resetAt: number;
}
const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string, limit = 30, windowMs = 60_000, now = Date.now()) {
    const bucket = buckets.get(key);
    if (!bucket || now >= bucket.resetAt) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
    }
    if (bucket.count >= limit) return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
    bucket.count += 1;
    return { allowed: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

export function resetRateLimits() {
    buckets.clear();
}
