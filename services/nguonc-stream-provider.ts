import type { StreamProvider, StreamSource } from '@/types/movie';
import { nguoncService, type NguoncEpisodeItem, type NguoncEpisodeServer } from '@/services/nguonc.service';

export class NguoncStreamProvider implements StreamProvider {
    async getMovieSources(movieSlug: string): Promise<StreamSource[]> {
        return this.getEpisodeSources(movieSlug, 1, 1);
    }

    async getEpisodeSources(movieSlug: string, _season: number, episodeNumber: number): Promise<StreamSource[]> {
        const detail = await nguoncService.getFilmDetail(movieSlug);
        const film = detail?.movie ?? detail?.film;
        if (!film?.episodes?.length) return [];

        return this.extractSources(film.episodes, episodeNumber);
    }

    private getEpisodes(server: NguoncEpisodeServer): NguoncEpisodeItem[] {
        return server.items ?? server.server_data ?? [];
    }

    private getEpisodeAt(server: NguoncEpisodeServer, episodeNumber: number): NguoncEpisodeItem | undefined {
        const episodes = this.getEpisodes(server);
        return (
            episodes.find((episode) => Number(episode.name.match(/\d+/)?.[0]) === episodeNumber) ??
            episodes[episodeNumber - 1] ??
            episodes[0]
        );
    }

    private extractSources(servers: NguoncEpisodeServer[], episodeNumber: number): StreamSource[] {
        return servers.flatMap((server, serverIndex) => {
            const episode = this.getEpisodeAt(server, episodeNumber);
            if (!episode) return [];

            const serverName = server.server_name || `NguonC #${serverIndex + 1}`;
            const sources: StreamSource[] = [];
            const m3u8Url = episode.m3u8 ?? episode.link_m3u8;
            const mp4Url = episode.mp4 ?? episode.link_mp4;
            const embedUrl = episode.embed ?? episode.link_embed;

            if (m3u8Url?.startsWith('http')) {
                sources.push({
                    id: `${serverName}-${episode.slug || episodeNumber}-hls`,
                    serverName,
                    type: 'hls',
                    url: m3u8Url,
                    quality: 'Auto',
                });
            }

            if (mp4Url?.startsWith('http')) {
                sources.push({
                    id: `${serverName}-${episode.slug || episodeNumber}-mp4`,
                    serverName,
                    type: 'mp4',
                    url: mp4Url,
                    quality: 'MP4',
                });
            }

            if (embedUrl?.startsWith('http')) {
                sources.push({
                    id: `${serverName}-${episode.slug || episodeNumber}-embed`,
                    serverName,
                    type: 'embed',
                    url: embedUrl,
                });
            }

            return sources;
        });
    }
}
