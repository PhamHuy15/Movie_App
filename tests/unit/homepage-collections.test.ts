import { describe, expect, it } from 'vitest';
import { fillCollection } from '@/services/homepage-collections.service';
import { fixtureMovie } from '@/tests/fixtures/movies';

function movie(index: number) {
    return { ...fixtureMovie, id: index, slug: `movie-${index}`, title: `Movie ${index}` };
}

describe('fillCollection', () => {
    it('ưu tiên phim đúng chủ đề, loại slug trùng và bổ sung đủ 10 phim', () => {
        const primary = [movie(1), movie(2), movie(2), movie(3)];
        const fallback = Array.from({ length: 12 }, (_, index) => movie(index + 1));

        const result = fillCollection(primary, fallback);

        expect(result).toHaveLength(10);
        expect(result.slice(0, 3).map((item) => item.slug)).toEqual(['movie-1', 'movie-2', 'movie-3']);
        expect(new Set(result.map((item) => item.slug)).size).toBe(10);
    });

    it('luôn nhắm tối thiểu 7 phim khi limit nhỏ hơn 7', () => {
        const result = fillCollection([], Array.from({ length: 8 }, (_, index) => movie(index + 1)), 4);
        expect(result).toHaveLength(7);
    });
});

