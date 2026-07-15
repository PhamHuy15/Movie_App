const DEFAULT_BASE_URL = 'https://phim.nguonc.com/api';
const BASE_URL = (process.env.NGUONC_API_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(/\/$/, '');
const DEFAULT_TIMEOUT = 12_000;

export type NguoncCategorySlug = 'phim-bo' | 'phim-le' | 'hoat-hinh' | 'tv-shows' | 'dang-chieu';

export interface NguoncCategoryGroup {
    group: { id: string; name: string };
    list: Array<{ id: string; name: string }>;
}

export interface NguoncFilmListItem {
    id?: string;
    name: string;
    slug: string;
    original_name?: string;
    origin_name?: string;
    description?: string | null;
    thumb_url?: string | null;
    poster_url?: string | null;
    time?: string | null;
    total_episodes?: number;
    current_episode?: string | null;
    episode_current?: string | null;
    episode_total?: string | number | null;
    quality?: string | null;
    language?: string | null;
    lang?: string | null;
    year?: number | string | null;
    created?: string;
    modified?: string;
    view?: number;
    actor?: string[] | string | null;
    casts?: string | null;
    director?: string | string[] | null;
    trailer_url?: string | null;
    category?: Array<{ id: string; name: string }> | Record<string, NguoncCategoryGroup>;
    country?: Array<{ id: string; name: string }>;
}

export interface NguoncEpisodeItem {
    name: string;
    slug: string;
    embed?: string | null;
    m3u8?: string | null;
    mp4?: string | null;
    link_embed?: string | null;
    link_m3u8?: string | null;
    link_mp4?: string | null;
}

export interface NguoncEpisodeServer {
    server_name: string;
    items?: NguoncEpisodeItem[];
    server_data?: NguoncEpisodeItem[];
}

export interface NguoncFilmDetail extends NguoncFilmListItem {
    episodes?: NguoncEpisodeServer[];
}

export interface NguoncPaginate {
    current_page: number;
    total_page: number;
    total_items: number;
    items_per_page: number;
}

export interface NguoncListResponse {
    status: string | boolean;
    items: NguoncFilmListItem[];
    paginate: NguoncPaginate;
    cat?: { name: string; title: string; slug: string };
}

export interface NguoncDetailResponse {
    status: string | boolean;
    movie?: NguoncFilmDetail;
    film?: NguoncFilmDetail;
}

async function fetchApi<T>(path: string, revalidate = 300): Promise<T | null> {
    try {
        const res = await fetch(`${BASE_URL}${path}`, {
            headers: {
                Accept: 'application/json',
                'User-Agent': 'CinevaDemo/1.0 (+https://movie-app-one-kohl.vercel.app)',
            },
            next: { revalidate },
            signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
        });

        if (!res.ok) {
            console.error('[NguonC] Request failed', {
                status: res.status,
                path,
                region: process.env.VERCEL_REGION ?? 'local',
            });
            return null;
        }
        return (await res.json()) as T;
    } catch (error) {
        console.error('[NguonC] Request error', {
            path,
            region: process.env.VERCEL_REGION ?? 'local',
            message: error instanceof Error ? error.message : String(error),
        });
        return null;
    }
}

export const nguoncService = {
    getNewFilms: (page = 1) => fetchApi<NguoncListResponse>(`/films/phim-moi-cap-nhat?page=${page}`),

    getFilmsByCategory: (slug: NguoncCategorySlug, page = 1) =>
        fetchApi<NguoncListResponse>(`/films/danh-sach/${slug}?page=${page}`),

    getFilmsByGenre: (slug: string, page = 1) =>
        fetchApi<NguoncListResponse>(`/films/the-loai/${encodeURIComponent(slug)}?page=${page}`),

    getFilmsByCountry: (slug: string, page = 1) =>
        fetchApi<NguoncListResponse>(`/films/quoc-gia/${encodeURIComponent(slug)}?page=${page}`),

    searchFilms: (keyword: string, page = 1) =>
        fetchApi<NguoncListResponse>(`/films/search?keyword=${encodeURIComponent(keyword)}&page=${page}`, 60),

    getFilmDetail: (slug: string) => fetchApi<NguoncDetailResponse>(`/film/${encodeURIComponent(slug)}`, 120),
};
