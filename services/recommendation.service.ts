import type { Movie } from '@/types/movie';
import { movieCatalogService } from '@/services/movie-catalog.service';
import { uniqueMovies } from '@/lib/utils';

function score(movie: Movie, seed: Movie | undefined, preferredGenres: string[], preferredCountries: string[]) {
    let value = (movie.rating || 0) + Math.min((movie.viewCount ?? 0) / 1_000_000, 2);
    if (movie.featured) value += 1.5;
    if (preferredCountries.includes(movie.country.code)) value += 2;
    value += movie.genres.filter((genre) => preferredGenres.includes(genre.name)).length * 1.5;
    if (seed) {
        if (movie.country.code === seed.country.code) value += 1.5;
        value += movie.genres.filter((genre) => seed.genres.some((item) => item.id === genre.id || item.name === genre.name)).length;
    }
    return value;
}

async function candidatePool() {
    const results = await Promise.all([
        movieCatalogService.listNew(1),
        movieCatalogService.listNew(2),
        movieCatalogService.listByCategory('phim-bo', 1),
        movieCatalogService.listByCategory('phim-le', 1),
        movieCatalogService.listByCategory('hoat-hinh', 1),
    ]);
    return uniqueMovies(results.flatMap((result) => result.movies));
}

function rank(candidates: Movie[], seed: Movie | undefined, genres: string[], countries: string[], excluded: Iterable<string>) {
    return uniqueMovies(candidates, excluded).sort((a, b) => score(b, seed, genres, countries) - score(a, seed, genres, countries));
}

export const recommendationService = {
    async getTrendingMovies(limit = 12, excluded: Iterable<string> = []) {
        return rank(await candidatePool(), undefined, [], [], excluded).slice(0, limit);
    },
    async getSimilarMovies(movieId: number, limit = 12) {
        const [catalog, seed] = await Promise.all([candidatePool(), movieCatalogService.findById(movieId)]);
        return rank(catalog, seed ?? undefined, [], [], seed ? [seed.slug] : []).slice(0, limit);
    },
    async getForUser(
        preferredGenres: string[] = [],
        preferredCountries: string[] = [],
        limit = 12,
        excluded: Iterable<string> = [],
    ) {
        return rank(await candidatePool(), undefined, preferredGenres, preferredCountries, excluded).slice(0, limit);
    },
};
