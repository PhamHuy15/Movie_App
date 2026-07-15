import type { StreamProvider, StreamSource } from '@/types/movie';

const BASE_URL = process.env.PHIMAPI_BASE_URL ?? 'https://phimapi.com';
interface Episode { name?: string; slug?: string; link_m3u8?: string; link_embed?: string }
interface Server { server_name?: string; server_data?: Episode[] }
interface Detail { episodes?: Server[] }

async function detail(slug: string): Promise<Detail | null> {
    try {
        const response = await fetch(`${BASE_URL}/phim/${encodeURIComponent(slug)}`, { next: { revalidate: 120 }, signal: AbortSignal.timeout(10_000), headers: { Accept: 'application/json' } });
        return response.ok ? ((await response.json()) as Detail) : null;
    } catch { return null; }
}

export class PhimApiStreamProvider implements StreamProvider {
    getMovieSources(slug: string) { return this.getEpisodeSources(slug, 1, 1); }
    async getEpisodeSources(slug: string, _season: number, episodeNumber: number): Promise<StreamSource[]> {
        const payload = await detail(slug);
        return (payload?.episodes ?? []).flatMap((server, serverIndex) => {
            const episodes = server.server_data ?? [];
            const episode = episodes.find((item) => Number(item.name?.match(/\d+/)?.[0]) === episodeNumber) ?? episodes[episodeNumber - 1];
            if (!episode) return [];
            const name = `KKPhim · ${server.server_name || `Server ${serverIndex + 1}`}`;
            const sources: StreamSource[] = [];
            if (episode.link_m3u8?.startsWith('https://')) sources.push({ id: `kk-${serverIndex}-${episode.slug ?? episodeNumber}-hls`, serverName: name, type: 'hls', url: episode.link_m3u8, quality: 'HLS Auto' });
            if (episode.link_embed?.startsWith('https://')) sources.push({ id: `kk-${serverIndex}-${episode.slug ?? episodeNumber}-embed`, serverName: `${name} · Embed`, type: 'embed', url: episode.link_embed });
            return sources;
        });
    }
}
