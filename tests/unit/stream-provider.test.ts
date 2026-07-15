import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { NguoncStreamProvider } from '@/services/nguonc-stream-provider';
import { getStreamProvider } from '@/services/stream-provider';
import { CompositeStreamProvider } from '@/services/stream-provider';
import { server } from '@/tests/mocks/server';

describe('stream providers', () => {
    it('chọn NguoncStreamProvider làm stream provider chính', () => {
        expect(getStreamProvider()).toBeInstanceOf(CompositeStreamProvider);
    });

    it('NguonC stream adapter chuẩn hóa response từ mock server', async () => {
        const sources = await new NguoncStreamProvider().getMovieSources('phim-1');
        expect(sources[0]).toMatchObject({ serverName: 'Vietsub #1', type: 'hls', url: 'https://embed.stream/1.m3u8' });
        expect(sources[1]).toMatchObject({ serverName: 'Vietsub #1', type: 'embed', url: 'https://embed.stream/1' });
    });

    it('NguonC stream adapter hỗ trợ episode sources', async () => {
        const sources = await new NguoncStreamProvider().getEpisodeSources('phim-1', 1, 2);
        expect(sources[0]).toMatchObject({ serverName: 'Vietsub #1', type: 'hls', url: 'https://embed.stream/2.m3u8' });
    });

    it('404 trả empty source', async () => {
        server.use(
            http.get('https://phim.nguonc.com/api/film/missing-slug', () => {
                return new HttpResponse(null, { status: 404 });
            }),
        );
        const sources = await new NguoncStreamProvider().getMovieSources('missing-slug');
        expect(sources).toEqual([]);
    });
});
