import { beforeEach, describe, expect, it } from 'vitest';
import { checkRateLimit, resetRateLimits } from '@/lib/rate-limit';
describe('rate limit', () => {
    beforeEach(resetRateLimits);
    it('trả 429 state khi vượt giới hạn và reset theo cửa sổ', () => {
        expect(checkRateLimit('ip', 2, 1000, 0).allowed).toBe(true);
        expect(checkRateLimit('ip', 2, 1000, 1).allowed).toBe(true);
        expect(checkRateLimit('ip', 2, 1000, 2).allowed).toBe(false);
        expect(checkRateLimit('ip', 2, 1000, 1001).allowed).toBe(true);
    });
});
