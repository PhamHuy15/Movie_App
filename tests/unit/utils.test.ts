import { describe, expect, it } from 'vitest';
import { cn, imageUrl } from '@/lib/utils';

describe('utils', () => {
    it('ghép class Tailwind không xung đột', () => {
        expect(cn('p-2', 'p-4')).toBe('p-4');
    });

    it('chuẩn hóa image URL và fallback', () => {
        expect(imageUrl('poster.jpg')).toBe('/poster.jpg');
        expect(imageUrl('https://phim.nguonc.com/poster.jpg')).toBe('https://phim.nguonc.com/poster.jpg');
        expect(imageUrl(null)).toBe('/placeholder.svg');
    });
});
