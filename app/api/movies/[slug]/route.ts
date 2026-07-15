import { NextResponse } from 'next/server';
import { movieCatalogService } from '@/services/movie-catalog.service';
import { recommendationService } from '@/services/recommendation.service';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
    const movie = await movieCatalogService.detail((await params).slug);
    if (!movie) return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    const similar = await recommendationService.getSimilarMovies(movie.id, 12);
    return NextResponse.json({ movie, similar }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900' } });
}
