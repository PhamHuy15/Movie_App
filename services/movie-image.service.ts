import type { Movie } from '@/types/movie';

const PHIMAPI_BASE_URL = process.env.PHIMAPI_BASE_URL ?? 'https://phimapi.com';
const IMAGE_REVALIDATE_SECONDS = 6 * 60 * 60;
const MAX_HERO_IMAGES = 5;

interface PhimApiImagePayload {
    movie?: {
        poster_url?: string | null;
        thumb_url?: string | null;
    };
}

export interface MovieImageSet {
    posterUrl: string;
    backdropUrl: string;
    source: 'phimapi' | 'nguonc';
}

function validImageUrl(value?: string | null): string | null {
    if (!value) return null;
    try {
        const url = new URL(value);
        return url.protocol === 'https:' ? url.toString() : null;
    } catch {
        return null;
    }
}

export async function resolveMovieImages(movie: Pick<Movie, 'slug' | 'posterUrl' | 'backdropUrl'>): Promise<MovieImageSet> {
    const fallback: MovieImageSet = {
        posterUrl: movie.posterUrl,
        backdropUrl: movie.backdropUrl,
        source: 'nguonc',
    };

    try {
        const response = await fetch(`${PHIMAPI_BASE_URL}/phim/${encodeURIComponent(movie.slug)}`, {
            headers: { Accept: 'application/json' },
            next: { revalidate: IMAGE_REVALIDATE_SECONDS },
            signal: AbortSignal.timeout(4_000),
        });
        if (!response.ok) return fallback;

        const payload = (await response.json()) as PhimApiImagePayload;
        const posterUrl = validImageUrl(payload.movie?.poster_url);
        const backdropUrl = validImageUrl(payload.movie?.thumb_url);
        if (!posterUrl && !backdropUrl) return fallback;

        return {
            posterUrl: posterUrl ?? fallback.posterUrl,
            backdropUrl: backdropUrl ?? fallback.backdropUrl,
            source: 'phimapi',
        };
    } catch {
        return fallback;
    }
}

export async function enrichHeroMovieImages(movies: Movie[]): Promise<Movie[]> {
    const selected = movies.slice(0, MAX_HERO_IMAGES);
    const imageSets = await Promise.all(selected.map(resolveMovieImages));
    return selected.map((movie, index) => ({
        ...movie,
        posterUrl: imageSets[index].posterUrl,
        backdropUrl: imageSets[index].backdropUrl,
    }));
}

