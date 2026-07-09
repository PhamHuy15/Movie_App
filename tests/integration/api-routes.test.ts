import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { GET as getMovies } from '@/app/api/movies/route';
import { GET as getMovieStream } from '@/app/api/stream/[movieId]/route';
import { GET as getEpisodeStream } from '@/app/api/stream/[movieId]/[season]/[episode]/route';
import { resetRateLimits } from '@/lib/rate-limit';

describe('API routes', () => {
    beforeEach(() => {
        resetRateLimits();
    });

    it('metadata trả schema và cache header', async () => {
        const response = await getMovies(
            new NextRequest('http://localhost/api/movies', { headers: { 'x-forwarded-for': 'unit-1' } }),
        );
        const body = await response.json();
        expect(response.status).toBe(200);
        expect(Array.isArray(body.data)).toBe(true);
        expect(response.headers.get('cache-control')).toContain('s-maxage=300');
    });

    it('từ chối query và slug phim không hợp lệ', async () => {
        const query = 'x'.repeat(101);
        expect(
            (
                await getMovies(
                    new NextRequest(`http://localhost/api/movies?q=${query}`, {
                        headers: { 'x-forwarded-for': 'unit-2' },
                    }),
                )
            ).status,
        ).toBe(400);
        expect(
            (
                await getMovieStream(new NextRequest('http://localhost'), {
                    params: Promise.resolve({ movieId: '../secret' }),
                })
            ).status,
        ).toBe(400);
    });

    it('stream route trả empty source khi NguonC không có phim', async () => {
        const response = await getMovieStream(new NextRequest('http://localhost'), {
            params: Promise.resolve({ movieId: 'unknown' }),
        });
        const text = await response.text();
        expect(response.status).toBe(200);
        expect(JSON.parse(text).sources).toEqual([]);
    });

    it('episode route validate season và trả source hợp lệ', async () => {
        const invalid = await getEpisodeStream(new NextRequest('http://localhost'), {
            params: Promise.resolve({ movieId: 'phim-1', season: '0', episode: '1' }),
        });
        expect(invalid.status).toBe(400);

        const valid = await getEpisodeStream(new NextRequest('http://localhost'), {
            params: Promise.resolve({ movieId: 'phim-1', season: '1', episode: '1' }),
        });
        expect((await valid.json()).sources).toHaveLength(2);
    });

    it('rate limit trả 429', async () => {
        let status = 0;
        for (let index = 0; index < 31; index += 1) {
            status = (
                await getMovies(
                    new NextRequest('http://localhost/api/movies', { headers: { 'x-forwarded-for': 'flood' } }),
                )
            ).status;
        }
        expect(status).toBe(429);
    });
});
