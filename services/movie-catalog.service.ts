import type { Movie, MovieDetail } from '@/types/movie';
import { nguoncService, type NguoncCategorySlug, type NguoncListResponse } from '@/services/nguonc.service';
import { normalizeNguoncDetail, normalizeNguoncFilm } from '@/services/nguonc-normalizer';
import { resolveMovieImages } from '@/services/movie-image.service';

export interface CatalogResult {
    movies: Movie[];
    totalPages: number;
    totalItems: number;
    currentPage: number;
}

const empty = (page = 1): CatalogResult => ({
    movies: [],
    totalPages: 1,
    totalItems: 0,
    currentPage: page,
});

function normalizeList(data: NguoncListResponse | null, page: number): CatalogResult {
    if (!data?.items?.length) return empty(page);

    return {
        movies: data.items.map(normalizeNguoncFilm),
        totalPages: data.paginate?.total_page ?? 1,
        totalItems: data.paginate?.total_items ?? data.items.length,
        currentPage: data.paginate?.current_page ?? page,
    };
}

export const movieCatalogService = {
    async listNew(page = 1): Promise<CatalogResult> {
        return normalizeList(await nguoncService.getNewFilms(page), page);
    },

    async list(): Promise<Movie[]> {
        const result = await movieCatalogService.listNew(1);
        return result.movies;
    },

    async listByCategory(category: NguoncCategorySlug, page = 1): Promise<CatalogResult> {
        return normalizeList(await nguoncService.getFilmsByCategory(category, page), page);
    },

    async listByGenre(slug: string, page = 1): Promise<CatalogResult> {
        if (!slug.trim()) return empty(page);
        return normalizeList(await nguoncService.getFilmsByGenre(slug, page), page);
    },

    async listByCountry(slug: string, page = 1): Promise<CatalogResult> {
        if (!slug.trim()) return empty(page);
        return normalizeList(await nguoncService.getFilmsByCountry(slug, page), page);
    },

    async listBySearch(keyword: string, page = 1): Promise<CatalogResult> {
        if (!keyword.trim()) return empty(page);
        return normalizeList(await nguoncService.searchFilms(keyword, page), page);
    },

    async detail(slug: string): Promise<MovieDetail | null> {
        const data = await nguoncService.getFilmDetail(slug);
        const film = data?.movie ?? data?.film;
        if (!film) return null;

        const movie = normalizeNguoncDetail(film);
        const images = await resolveMovieImages(movie);
        return { ...movie, posterUrl: images.posterUrl, backdropUrl: images.backdropUrl };
    },

    async search(query: string, page = 1): Promise<Movie[]> {
        const result = await movieCatalogService.listBySearch(query, page);
        return result.movies;
    },

    async findById(id: number): Promise<Movie | null> {
        const result = await movieCatalogService.listNew(1);
        return result.movies.find((movie) => movie.id === id) ?? null;
    },
};
