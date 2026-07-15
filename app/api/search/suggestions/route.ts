import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { movieCatalogService } from '@/services/movie-catalog.service';
import { uniqueMovies } from '@/lib/utils';

const schema = z.object({ q: z.string().trim().min(2).max(100), limit: z.coerce.number().int().min(1).max(10).default(7) });

export async function GET(request: NextRequest) {
    const parsed = schema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
    if (!parsed.success) return NextResponse.json({ data: [] }, { status: 400 });
    const result = await movieCatalogService.listBySearch(parsed.data.q, 1);
    const data = uniqueMovies(result.movies).slice(0, parsed.data.limit).map((movie) => ({
        id: movie.id,
        slug: movie.slug,
        title: movie.title,
        originalTitle: movie.originalTitle,
        year: movie.year,
        posterUrl: movie.posterUrl,
        latestEpisode: movie.latestEpisode,
    }));
    return NextResponse.json({ data }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=180' } });
}
