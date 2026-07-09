import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { movieCatalogService } from '@/services/movie-catalog.service';

const schema = z.object({
    q: z.string().trim().max(100).optional(),
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

    const data = parsed.data.q ? await movieCatalogService.search(parsed.data.q) : await movieCatalogService.list();
    return NextResponse.json(
        { data },
        {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                'X-RateLimit-Remaining': String(rate.remaining),
            },
        },
    );
}
