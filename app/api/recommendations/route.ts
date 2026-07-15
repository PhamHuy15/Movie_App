import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { recommendationService } from '@/services/recommendation.service';

const querySchema = z.object({
    genres: z.string().optional(),
    countries: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(30).default(12),
});

export async function GET(request: NextRequest) {
    const parsed = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
    if (!parsed.success) return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
    const genres = parsed.data.genres?.split(',').map((value) => value.trim()).filter(Boolean) ?? [];
    const countries = parsed.data.countries?.split(',').map((value) => value.trim()).filter(Boolean) ?? [];
    const movies = await recommendationService.getForUser(genres, countries, parsed.data.limit);
    return NextResponse.json({ data: movies }, { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' } });
}
