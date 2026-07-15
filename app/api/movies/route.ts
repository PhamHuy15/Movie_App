import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { getMovieProvider } from '@/services/movie-provider';

const schema = z.object({
    q: z.string().trim().max(100).optional(),
    page: z.coerce.number().int().min(1).default(1),
    category: z.string().optional(),
    genre: z.string().optional(),
    country: z.string().optional(),
});

export async function GET(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'local';
    const rate = checkRateLimit(`movies:${ip}`);

    if (!rate.allowed) {
        return NextResponse.json(
            { error: 'Too many requests' },
            {
                status: 429,
                headers: { 'Retry-After': String(Math.ceil((rate.resetAt - Date.now()) / 1000)) },
            },
        );
    }

    const parsed = schema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
    if (!parsed.success) return NextResponse.json({ error: 'Invalid query' }, { status: 400 });

    const data = await getMovieProvider().listMovies({
        page: parsed.data.page,
        keyword: parsed.data.q,
        category: parsed.data.category,
        genre: parsed.data.genre,
        country: parsed.data.country,
    });
    return NextResponse.json(
        { data: data.movies, pagination: { totalPages: data.totalPages, totalItems: data.totalItems, currentPage: data.currentPage } },
        {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                'X-RateLimit-Remaining': String(rate.remaining),
            },
        },
    );
}
