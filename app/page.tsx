import { HeroCarousel } from '@/components/home/hero-carousel';
import { MovieSection } from '@/components/home/movie-section';
import { movieCatalogService } from '@/services/movie-catalog.service';
import { recommendationService } from '@/services/recommendation.service';
import { ContinueWatching } from '@/components/home/continue-watching';
import { uniqueMovies } from '@/lib/utils';
import { enrichHeroMovieImages } from '@/services/movie-image.service';
import { homepageCollectionsService } from '@/services/homepage-collections.service';

export default async function Home() {
    const [newResult, seriesResult, singleResult, animeResult] = await Promise.all([
        movieCatalogService.listNew(1),
        movieCatalogService.listByCategory('phim-bo', 1),
        movieCatalogService.listByCategory('phim-le', 1),
        movieCatalogService.listByCategory('hoat-hinh', 1),
    ]);

    const newMovies = newResult.movies;
    const seriesMovies = seriesResult.movies;
    const singleMovies = singleResult.movies;
    const animeMovies = animeResult.movies;
    const heroCandidates = uniqueMovies([...newMovies.slice(0, 4), ...seriesMovies.slice(0, 4)]).slice(0, 5);
    const heroPool = await enrichHeroMovieImages(heroCandidates);
    const visibleNew = uniqueMovies(newMovies).slice(0, 12);
    const trending = await recommendationService.getTrendingMovies(12, visibleNew.map((movie) => movie.slug));
    const recommendations = await recommendationService.getForUser(
        [],
        [],
        10,
        [...visibleNew, ...trending].map((movie) => movie.slug),
    );
    const fallbackPool = uniqueMovies([...newMovies, ...seriesMovies, ...singleMovies, ...animeMovies, ...trending]);
    const collections = await homepageCollectionsService.getCollections(recommendations, fallbackPool);

    return (
        <>
            <HeroCarousel movies={heroPool} />
            <div className="relative z-10 -mt-3">
                <ContinueWatching />
                <MovieSection title="Phim Mới Cập Nhật" href="/movies" movies={visibleNew} />
                <MovieSection title="Top Phim Thịnh Hành" href="/discover" movies={trending} />
                {collections.map((item) => <MovieSection key={item.id} title={item.title} href={item.href} movies={item.movies} />)}
                <MovieSection title="Phim Bộ Nổi Bật" href="/series" movies={seriesMovies.slice(0, 12)} />
                <MovieSection title="Phim Lẻ Đặc Sắc" href="/single-movies" movies={singleMovies.slice(0, 12)} />
                <MovieSection title="Hoạt Hình" href="/animation" movies={animeMovies.slice(0, 12)} />
            </div>
        </>
    );
}
