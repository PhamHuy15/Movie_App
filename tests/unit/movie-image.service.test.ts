import { afterEach, describe, expect, it, vi } from 'vitest';
import { normalizeLegacyNguoncPosterUrl } from '@/lib/movie-images';
import { enrichHeroMovieImages, resolveMovieImages } from '@/services/movie-image.service';
import { fixtureMovie } from '@/tests/fixtures/movies';

const fallbackMovie = {
    ...fixtureMovie,
    slug: 'ky-uc-tinh-thu',
    posterUrl: 'https://phim.nguonc.com/public/images/Post/3/ky-uc-tinh-thu.jpg',
    backdropUrl: 'https://phim.nguonc.com/public/images/Post/3/ky-uc-tinh-thu-1.jpg',
};

afterEach(() => vi.unstubAllGlobals());

describe('movie image service', () => {
    it('ưu tiên poster dọc và backdrop ngang từ PhimApi', async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
            movie: {
                poster_url: 'https://phimimg.com/poster.jpg',
                thumb_url: 'https://phimimg.com/backdrop.jpg',
            },
        }), { status: 200 }));
        vi.stubGlobal('fetch', fetchMock);

        await expect(resolveMovieImages(fallbackMovie)).resolves.toEqual({
            posterUrl: 'https://phimimg.com/poster.jpg',
            backdropUrl: 'https://phimimg.com/backdrop.jpg',
            source: 'phimapi',
        });
        expect(fetchMock).toHaveBeenCalledWith(
            'https://phimapi.com/phim/ky-uc-tinh-thu',
            expect.objectContaining({ next: { revalidate: 21_600 } }),
        );
    });

    it.each([
        ['phim không tồn tại', new Response('{}', { status: 404 })],
        ['URL ảnh không hợp lệ', new Response(JSON.stringify({ movie: { poster_url: 'javascript:bad', thumb_url: '/relative.jpg' } }), { status: 200 })],
    ])('fallback NguonC khi %s', async (_label, response) => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
        await expect(resolveMovieImages(fallbackMovie)).resolves.toMatchObject({
            posterUrl: fallbackMovie.posterUrl,
            backdropUrl: fallbackMovie.backdropUrl,
            source: 'nguonc',
        });
    });

    it('fallback NguonC khi request timeout hoặc lỗi mạng', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new DOMException('Timeout', 'TimeoutError')));
        await expect(resolveMovieImages(fallbackMovie)).resolves.toMatchObject({ source: 'nguonc' });
    });

    it('chỉ làm giàu tối đa 5 phim banner', async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 404 }));
        vi.stubGlobal('fetch', fetchMock);
        const movies = Array.from({ length: 7 }, (_, index) => ({ ...fallbackMovie, slug: `movie-${index}` }));

        const result = await enrichHeroMovieImages(movies);

        expect(result).toHaveLength(5);
        expect(fetchMock).toHaveBeenCalledTimes(5);
    });
});

describe('normalizeLegacyNguoncPosterUrl', () => {
    it('sửa poster NguonC cũ từ ảnh ngang sang ảnh dọc', () => {
        expect(normalizeLegacyNguoncPosterUrl('https://phim.nguonc.com/public/images/Post/3/ky-uc-tinh-thu-1.jpg'))
            .toBe('https://phim.nguonc.com/public/images/Post/3/ky-uc-tinh-thu.jpg');
    });

    it('không thay đổi URL từ nguồn khác', () => {
        expect(normalizeLegacyNguoncPosterUrl('https://phimimg.com/poster-1.jpg'))
            .toBe('https://phimimg.com/poster-1.jpg');
    });
});
