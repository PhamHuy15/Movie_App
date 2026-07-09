import { describe, expect, it } from 'vitest';
import { createMappingKey, movieSourceMappingSchema } from '@/lib/source-mapping';

describe('source mapping', () => {
    it('tạo mapping key theo provider và slug NguonC', () => {
        expect(createMappingKey({ nguoncSlug: 'goc-toi-nhan-ban', provider: 'licensed', type: 'series' })).toBe(
            'licensed:nguonc:goc-toi-nhan-ban',
        );
    });

    it('từ chối slug hoặc provider không hợp lệ', () => {
        expect(
            movieSourceMappingSchema.safeParse({
                nguoncSlug: '../secret',
                provider: 'x',
                type: 'movie',
            }).success,
        ).toBe(false);
    });
});
