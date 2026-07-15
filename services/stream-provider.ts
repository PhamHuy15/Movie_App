import type { StreamProvider, StreamSource } from '@/types/movie';
import { NguoncStreamProvider } from '@/services/nguonc-stream-provider';
import { OPhimStreamProvider } from '@/services/ophim-stream-provider';
import { PhimApiStreamProvider } from '@/services/phimapi-stream-provider';

function uniqueSources(sources: StreamSource[]) {
    const seen = new Set<string>();
    return sources.filter((source) => {
        if (!source.url || seen.has(source.url)) return false;
        seen.add(source.url);
        return true;
    });
}

export class CompositeStreamProvider implements StreamProvider {
    constructor(private readonly providers: StreamProvider[] = [new PhimApiStreamProvider(), new OPhimStreamProvider(), new NguoncStreamProvider()]) {}

    async getMovieSources(movieId: string) {
        return this.collect((provider) => provider.getMovieSources(movieId));
    }
    async getEpisodeSources(movieId: string, season: number, episode: number) {
        return this.collect((provider) => provider.getEpisodeSources(movieId, season, episode));
    }
    private async collect(load: (provider: StreamProvider) => Promise<StreamSource[]>) {
        const results = await Promise.allSettled(this.providers.map(load));
        const all = uniqueSources(results.flatMap((result) => (result.status === 'fulfilled' ? result.value : [])));
        const direct = all.filter((source) => source.type !== 'embed');
        const embeds = all.filter((source) => source.type === 'embed');
        return direct.length ? [...direct, ...embeds] : embeds;
    }
}

export function getStreamProvider(): StreamProvider {
    return new CompositeStreamProvider();
}
