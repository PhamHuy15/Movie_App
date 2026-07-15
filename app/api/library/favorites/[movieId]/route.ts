import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { userIdFromRequest } from '@/lib/session';
export async function DELETE(request: Request, { params }: { params: Promise<{ movieId: string }> }) {
    const userId = userIdFromRequest(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await prisma.favorite.deleteMany({ where: { userId, movieId: Number((await params).movieId) } });
    return NextResponse.json({ ok: true });
}
