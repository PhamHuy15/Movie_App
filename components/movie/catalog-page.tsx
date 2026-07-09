import { MovieCard } from '@/components/movie/movie-card';
import { PaginationBar } from '@/components/movie/pagination-bar';
import { movieCatalogService } from '@/services/movie-catalog.service';

export type CatalogMode =
    | { type: 'new' }
    | { type: 'category'; slug: 'phim-bo' | 'phim-le' | 'hoat-hinh' | 'tv-shows' | 'dang-chieu' }
    | { type: 'genre'; slug: string }
    | { type: 'country'; slug: string }
    | { type: 'search'; keyword: string };

interface CatalogPageProps {
    title: string;
    subtitle?: string;
    mode?: CatalogMode;
    page?: number;
    hrefPrefix?: string;
}

export async function CatalogPage({ title, subtitle, mode = { type: 'new' }, page = 1, hrefPrefix }: CatalogPageProps) {
    const result =
        mode.type === 'category'
            ? await movieCatalogService.listByCategory(mode.slug, page)
            : mode.type === 'genre'
              ? await movieCatalogService.listByGenre(mode.slug, page)
              : mode.type === 'country'
                ? await movieCatalogService.listByCountry(mode.slug, page)
                : mode.type === 'search'
                  ? await movieCatalogService.listBySearch(mode.keyword, page)
                  : await movieCatalogService.listNew(page);

    const { movies, totalPages, totalItems, currentPage } = result;
    const buildHref = (nextPage: number) => `${hrefPrefix ?? '?'}page=${nextPage}`;

    return (
        <div className="px-5 pt-24 pb-16 lg:px-10">
            <p className="text-brand text-xs font-semibold tracking-[.18em] uppercase">Cineva · NguonC</p>
            <div className="mt-2 flex flex-wrap items-end gap-4">
                <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] font-bold">{title}</h1>
                {totalItems > 0 && (
                    <span className="mb-1 text-sm text-white/55">
                        {totalItems.toLocaleString('vi-VN')} phim · Trang {currentPage}/{totalPages}
                    </span>
                )}
            </div>
            {subtitle && <p className="mt-2 text-white/50">{subtitle}</p>}

            {movies.length ? (
                <>
                    <div
                        data-testid="movie-grid"
                        className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6"
                    >
                        {movies.map((movie) => (
                            <MovieCard key={movie.slug} movie={movie} />
                        ))}
                    </div>
                    <PaginationBar currentPage={currentPage} totalPages={totalPages} buildHref={buildHref} />
                </>
            ) : (
                <div role="status" className="mt-8 rounded-2xl border border-white/10 p-12 text-center text-white/50">
                    Chưa có nội dung phù hợp từ NguonC.
                </div>
            )}
        </div>
    );
}
