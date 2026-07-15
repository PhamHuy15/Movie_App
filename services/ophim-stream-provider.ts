import type { StreamProvider, StreamSource } from '@/types/movie';

const BASE_URL = process.env.OPHIM_API_BASE_URL ?? 'https://ophim1.com';

interface OPhimEpisode {
    name?: string;
    slug?: string;
    link_m3u8?: string;
    link_embed?: string;
}
interface OPhimServer {
    server_name?: string;
    server_data?: OPhimEpisode[];
}
interface OPhimDetailResponse {
    status?: boolean | string;
    episodes?: OPhimServer[];
}

async function getDetail(slug: string): Promise<OPhimDetailResponse | null> {
    try {
        const response = await fetch(`${BASE_URL}/phim/${encodeURIComponent(slug)}`, {
            next: { revalidate: 120 },
            signal: AbortSignal.timeout(10_000),
            headers: { Accept: 'application/json' },
        });
        return response.ok ? ((await response.json()) as OPhimDetailResponse) : null;
    } catch {
        return null;
    }
}

function episodeAt(server: OPhimServer, episodeNumber: number) {
    const episodes = server.server_data ?? [];
    return episodes.find((episode) => Number(episode.name?.match(/\d+/)?.[0]) === episodeNumber) ?? episodes[episodeNumber - 1];
}

export class OPhimStreamProvider implements StreamProvider {
    getMovieSources(movieSlug: string) {
        return this.getEpisodeSources(movieSlug, 1, 1);
    }

    async getEpisodeSources(movieSlug: string, _season: number, episodeNumber: number): Promise<StreamSource[]> {
        const detail = await getDetail(movieSlug);
        if (!detail?.episodes?.length) return [];
        return detail.episodes.flatMap((server, serverIndex) => {
            const episode = episodeAt(server, episodeNumber);
            if (!episode) return [];
            const serverName = `OPhim · ${server.server_name || `Server ${serverIndex + 1}`}`;
            const sources: StreamSource[] = [];
            if (episode.link_m3u8?.startsWith('https://')) sources.push({ id: `ophim-${serverIndex}-${episode.slug ?? episodeNumber}-hls`, serverName, type: 'hls', url: episode.link_m3u8, quality: 'HLS Auto' });
            if (episode.link_embed?.startsWith('https://')) sources.push({ id: `ophim-${serverIndex}-${episode.slug ?? episodeNumber}-embed`, serverName: `${serverName} · Embed`, type: 'embed', url: episode.link_embed });
            return sources;
        });
    }
}
