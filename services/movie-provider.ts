import type { Country, Genre, MovieProvider, StreamQuery, StreamSource } from '@/types/movie';
import { movieCatalogService } from '@/services/movie-catalog.service';
import { getStreamProvider } from '@/services/stream-provider';

const provider: MovieProvider = {
    listMovies: async (input) => {
        if (input.keyword) return movieCatalogService.listBySearch(input.keyword, input.page ?? 1);
        if (input.genre) return movieCatalogService.listByGenre(input.genre, input.page ?? 1);
        if (input.country) return movieCatalogService.listByCountry(input.country, input.page ?? 1);
        if (input.category) return movieCatalogService.listByCategory(input.category as never, input.page ?? 1);
        return movieCatalogService.listNew(input.page ?? 1);
    },
    getMovie: (slug) => movieCatalogService.detail(slug),
    searchMovies: ({ keyword, page }) => movieCatalogService.listBySearch(keyword, page ?? 1),
    getGenres: async (): Promise<Genre[]> => [],
    getCountries: async (): Promise<Country[]> => [],
    getStreamSources: ({ movieId, season, episode }: StreamQuery): Promise<StreamSource[]> =>
        season && episode ? getStreamProvider().getEpisodeSources(movieId, season, episode) : getStreamProvider().getMovieSources(movieId),
};

export function getMovieProvider(): MovieProvider {
    return provider;
}
