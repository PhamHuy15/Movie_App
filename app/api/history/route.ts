import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { userIdFromRequest } from '@/lib/session';
import { normalizeLegacyNguoncPosterUrl } from '@/lib/movie-images';
const schema = z.object({ movieId: z.number().int(), slug: z.string(), title: z.string(), posterUrl: z.string().min(1), progress: z.number().min(0), duration: z.number().min(0), season: z.number().int().optional(), episode: z.number().int().optional() });
export async function GET(request: Request) {
    const userId = userIdFromRequest(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const history = await prisma.watchHistory.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' }, take: 50 });
    return NextResponse.json({ data: history.map((item) => ({ ...item, posterUrl: normalizeLegacyNguoncPosterUrl(item.posterUrl) })) });
}
export async function POST(request: Request) {
    const userId = userIdFromRequest(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid history entry' }, { status: 400 });
    const data = { ...parsed.data, posterUrl: normalizeLegacyNguoncPosterUrl(parsed.data.posterUrl) };
    const history = await prisma.watchHistory.upsert({ where: { userId_movieId: { userId, movieId: data.movieId } }, update: data, create: { userId, ...data } });
    return NextResponse.json({ data: history });
}
