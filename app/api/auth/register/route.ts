import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createSession, hashPassword } from '@/lib/session';
const schema = z.object({ name: z.string().trim().max(80).optional(), email: z.email(), password: z.string().min(8).max(200) });
export async function POST(request: Request) {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' }, { status: 400 });
    const email = parsed.data.email.toLowerCase();
    if (await prisma.user.findUnique({ where: { email } })) return NextResponse.json({ error: 'Email đã được sử dụng' }, { status: 409 });
    const user = await prisma.user.create({ data: { name: parsed.data.name, email, passwordHash: hashPassword(parsed.data.password) } });
    const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
    response.cookies.set('cineva_session', createSession(user.id), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 30, path: '/' });
    return response;
}
