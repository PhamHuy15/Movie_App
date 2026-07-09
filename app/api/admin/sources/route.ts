import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({
    nguoncSlug: z
        .string()
        .trim()
        .min(1)
        .max(200)
        .regex(/^[a-z0-9-]+$/),
    provider: z.string().trim().min(2).max(50),
    serverName: z.string().trim().min(2).max(80),
    type: z.enum(['hls', 'mp4']),
    url: z.url().refine((url) => url.startsWith('https://'), 'Nguồn phát phải dùng HTTPS'),
    season: z.union([z.literal(''), z.coerce.number().int().positive()]).optional(),
    episode: z.union([z.literal(''), z.coerce.number().int().positive()]).optional(),
    subtitleUrl: z.union([z.literal(''), z.url()]).optional(),
    enabled: z.union([z.literal('on'), z.boolean()]).optional(),
});

export async function POST(request: NextRequest) {
    if (!process.env.DATABASE_URL) {
        return NextResponse.json({ error: 'Chưa cấu hình DATABASE_URL.' }, { status: 503 });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

    const data = parsed.data;

    try {
        const probe = await fetch(data.url, {
            method: 'HEAD',
            signal: AbortSignal.timeout(5_000),
            redirect: 'follow',
        });
        if (!probe.ok) {
            return NextResponse.json({ error: `Nguồn phát không phản hồi (${probe.status}).` }, { status: 422 });
        }

        const mapping = await prisma.movieSourceMapping.upsert({
            where: {
                provider_nguoncSlug: {
                    provider: data.provider,
                    nguoncSlug: data.nguoncSlug,
                },
            },
            update: { type: data.season ? 'series' : 'movie' },
            create: {
                nguoncSlug: data.nguoncSlug,
                provider: data.provider,
                type: data.season ? 'series' : 'movie',
            },
        });

        await prisma.streamSourceRecord.create({
            data: {
                mappingId: mapping.id,
                serverName: data.serverName,
                type: data.type,
                url: data.url,
                season: data.season === '' ? null : data.season,
                episode: data.episode === '' ? null : data.episode,
                enabled: Boolean(data.enabled),
                subtitles: data.subtitleUrl
                    ? [
                          {
                              label: 'Tiếng Việt',
                              language: 'vi',
                              url: data.subtitleUrl,
                              default: true,
                          },
                      ]
                    : undefined,
            },
        });

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Không thể kiểm tra hoặc lưu nguồn phát.' }, { status: 500 });
    }
}
