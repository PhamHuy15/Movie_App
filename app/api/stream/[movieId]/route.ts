import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStreamProvider } from '@/services/stream-provider';

const paramsSchema = z.object({
    movieId: z
        .string()
        .min(1)
        .max(200)
        .regex(/^[a-zA-Z0-9_-]+$/),
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ movieId: string }> }) {
    const parsed = paramsSchema.safeParse(await params);
    if (!parsed.success) return NextResponse.json({ error: 'Slug phim không hợp lệ' }, { status: 400 });

    try {
        const sources = await getStreamProvider().getMovieSources(parsed.data.movieId);
        return NextResponse.json({ sources }, { headers: { 'Cache-Control': 'private, max-age=30' } });
    } catch {
        return NextResponse.json({ error: 'Không thể tải nguồn phát từ NguonC', sources: [] }, { status: 502 });
    }
}
