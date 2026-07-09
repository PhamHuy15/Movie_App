import type { Episode, Movie, MovieDetail, Season } from '@/types/movie';
import type {
    NguoncCategoryGroup,
    NguoncEpisodeServer,
    NguoncFilmDetail,
    NguoncFilmListItem,
} from '@/services/nguonc.service';

const FALLBACK_POSTER = '/placeholder.svg';

function resolveImage(url?: string | null): string {
    if (!url) return FALLBACK_POSTER;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://phim.nguonc.com${url.startsWith('/') ? '' : '/'}${url}`;
}

function slugToId(slug: string): number {
    let hash = 0;
    for (let index = 0; index < slug.length; index += 1) {
        hash = (Math.imul(31, hash) + slug.charCodeAt(index)) | 0;
    }
    return Math.abs(hash);
}

function currentEpisodeText(film: NguoncFilmListItem): string {
    return String(film.current_episode ?? film.episode_current ?? '').trim();
}

function totalEpisodes(film: NguoncFilmListItem): number {
    const raw = film.total_episodes ?? film.episode_total;
    const numeric = Number(raw);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : 1;
}

function detectType(film: NguoncFilmListItem): 'movie' | 'series' {
    const episode = currentEpisodeText(film).toLowerCase();
    if (totalEpisodes(film) > 1) return 'series';
    if (episode && !['full', 'trailer'].includes(episode)) return 'series';
    return 'movie';
}

function parseLatestEpisode(film: NguoncFilmListItem): string | undefined {
    const episode = currentEpisodeText(film);
    if (!episode || /^full$/i.test(episode) || /^trailer$/i.test(episode)) return undefined;
    return episode.startsWith('Tập') || episode.startsWith('Hoàn tất') ? episode : `Tập ${episode}`;
}

function extractGroupItems(
    category: NguoncFilmListItem['category'],
    matcher: (groupName: string) => boolean,
): Array<{ id: string; name: string }> {
    if (!category || Array.isArray(category)) return [];

    return Object.values(category as Record<string, NguoncCategoryGroup>).flatMap((entry) => {
        const groupName = entry.group?.name ?? '';
        return matcher(groupName) ? (entry.list ?? []) : [];
    });
}

function extractGenres(category: NguoncFilmListItem['category']): { id: number; name: string }[] {
    if (!category) return [];
    const source = Array.isArray(category)
        ? category
        : extractGroupItems(category, (name) => name.toLowerCase().includes('thể loại'));

    return source.filter((item) => item.name).map((item, index) => ({ id: index + 1, name: item.name }));
}

function extractCountry(film: NguoncFilmListItem): { code: string; name: string } {
    const direct = film.country?.find((item) => item.name);
    if (direct) return { code: direct.id.slice(0, 8), name: direct.name };

    const fromCategory = extractGroupItems(film.category, (name) => name.toLowerCase().includes('quốc gia'))[0];
    if (fromCategory) return { code: fromCategory.id.slice(0, 8), name: fromCategory.name };

    return { code: 'unknown', name: 'Đang cập nhật' };
}

function extractYear(film: NguoncFilmListItem): number {
    const direct = Number(film.year);
    if (Number.isFinite(direct) && direct > 1900) return direct;

    const fromCategory = extractGroupItems(film.category, (name) => name.toLowerCase().includes('năm'))[0]?.name;
    const parsed = Number(fromCategory);
    if (Number.isFinite(parsed) && parsed > 1900) return parsed;

    const date = film.modified ?? film.created;
    if (date) {
        const year = new Date(date).getFullYear();
        if (Number.isFinite(year) && year > 1900) return year;
    }

    return new Date().getFullYear();
}

function extractRuntime(film: NguoncFilmListItem): number {
    const match = film.time?.match(/\d+/);
    return match ? Number(match[0]) : 0;
}

function extractActors(film: NguoncFilmDetail): string[] {
    if (Array.isArray(film.actor)) return film.actor.filter(Boolean);
    const source = typeof film.actor === 'string' ? film.actor : film.casts;
    return (
        source
            ?.split(',')
            .map((name) => name.trim())
            .filter(Boolean) ?? []
    );
}

function extractDirector(film: NguoncFilmDetail): string {
    if (Array.isArray(film.director)) return film.director.find(Boolean) ?? '';
    return film.director?.trim() ?? '';
}

function statusText(film: NguoncFilmListItem): string {
    const episode = currentEpisodeText(film);
    if (/full|hoàn tất/i.test(episode)) return 'Đã hoàn thành';
    if (episode) return episode;
    return 'Đang cập nhật';
}

function episodeNumber(item: { name: string }, index: number): number {
    const parsed = Number(item.name.match(/\d+/)?.[0]);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : index + 1;
}

function buildSeasons(servers: NguoncEpisodeServer[]): Season[] {
    const primaryServer = servers.find((server) => (server.items ?? server.server_data ?? []).length > 0);
    const episodeList = primaryServer ? (primaryServer.items ?? primaryServer.server_data ?? []) : [];

    const episodes: Episode[] = episodeList.map((episode, index) => {
        const number = episodeNumber(episode, index);
        return {
            id: episode.slug || `tap-${number}`,
            number,
            title: episode.name ? `Tập ${episode.name}` : `Tập ${number}`,
            duration: 0,
        };
    });

    return episodes.length ? [{ number: 1, title: 'Danh sách tập', episodes }] : [];
}

export function normalizeNguoncFilm(film: NguoncFilmListItem): Movie {
    return {
        id: slugToId(film.slug),
        slug: film.slug,
        title: film.name,
        originalTitle: film.original_name ?? film.origin_name ?? film.name,
        overview: film.description?.trim() ?? '',
        posterUrl: resolveImage(film.poster_url || film.thumb_url),
        backdropUrl: resolveImage(film.thumb_url || film.poster_url),
        year: extractYear(film),
        rating: 0,
        genres: extractGenres(film.category),
        country: extractCountry(film),
        type: detectType(film),
        quality: film.quality?.trim() || undefined,
        latestEpisode: parseLatestEpisode(film),
        featured: false,
    };
}

export function normalizeNguoncDetail(film: NguoncFilmDetail): MovieDetail {
    const base = normalizeNguoncFilm(film);
    const actors = extractActors(film);

    return {
        ...base,
        runtime: extractRuntime(film),
        status: statusText(film),
        director: extractDirector(film),
        credits: actors.slice(0, 12).map((name, index) => ({
            id: index + 1,
            name,
            character: '',
            profileUrl: undefined,
        })),
        seasons: buildSeasons(film.episodes ?? []),
        trailerKey: film.trailer_url ?? undefined,
    };
}
