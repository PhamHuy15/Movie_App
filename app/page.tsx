import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HeroCarousel } from '@/components/home/hero-carousel';
import { MovieSection } from '@/components/home/movie-section';
import { movieCatalogService } from '@/services/movie-catalog.service';
import type { Movie } from '@/types/movie';

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
    const heroPool = [...newMovies.slice(0, 3), ...seriesMovies.slice(0, 2)].slice(0, 5);

    return (
        <>
            <HeroCarousel movies={heroPool} />
            <div className="relative z-10 -mt-3">
                <SectionWithLink title="Phim mới cập nhật" href="/movies" movies={newMovies.slice(0, 12)} />
                <SectionWithLink title="Phim bộ nổi bật" href="/series" movies={seriesMovies.slice(0, 12)} />
                <SectionWithLink title="Phim lẻ đặc sắc" href="/single-movies" movies={singleMovies.slice(0, 12)} />
                <SectionWithLink title="Hoạt hình" href="/animation" movies={animeMovies.slice(0, 12)} />
            </div>
        </>
    );
}

function SectionWithLink({ title, href, movies }: { title: string; href: string; movies: Movie[] }) {
    if (!movies.length) return null;

    return (
        <div>
            <div className="flex items-center justify-between px-5 pt-10 pb-0 lg:px-10">
                <span className="font-display text-lg font-bold">{title}</span>
                <Link href={href} className="text-brand flex items-center gap-1 text-xs font-semibold hover:underline">
                    Xem tất cả <ArrowRight size={12} />
                </Link>
            </div>
            <MovieSection title="" movies={movies} />
        </div>
    );
}
