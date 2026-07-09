import { MovieCard } from '@/components/movie/movie-card';
import { PaginationBar } from '@/components/movie/pagination-bar';
import { SearchBox } from '@/components/search/search-box';
import { movieCatalogService } from '@/services/movie-catalog.service';
import type { Movie } from '@/types/movie';

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
    const { q = '', page } = await searchParams;
    const pageNum = Math.max(1, Number(page) || 1);
    let movies: Movie[] = [];
    let totalPages = 1;
    let totalItems = 0;

    if (q.trim()) {
        const result = await movieCatalogService.listBySearch(q, pageNum);
        movies = result.movies;
        totalPages = result.totalPages;
        totalItems = result.totalItems;
    }

    const buildHref = (nextPage: number) => `/search?q=${encodeURIComponent(q)}&page=${nextPage}`;

    return (
        <div className="px-5 pt-24 pb-16 lg:px-10">
            <h1 className="mb-6 text-3xl font-black">Tìm kiếm phim</h1>
            <div className="max-w-2xl">
                <SearchBox initial={q} />
            </div>

            {q && (
                <p className="mt-6 text-white/50">
                    {totalItems > 0
                        ? `${totalItems.toLocaleString('vi-VN')} kết quả cho "${q}" · Trang ${pageNum}/${totalPages}`
                        : `Không tìm thấy phim nào cho "${q}"`}
                </p>
            )}

            {movies.length ? (
                <>
                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6">
                        {movies.map((movie) => (
                            <MovieCard key={movie.slug} movie={movie} />
                        ))}
                    </div>
                    <PaginationBar currentPage={pageNum} totalPages={totalPages} buildHref={buildHref} />
                </>
            ) : (
                <div className="mt-12 rounded-2xl border border-dashed border-white/10 p-14 text-center text-white/45">
                    {q ? 'Không tìm thấy phim phù hợp. Hãy thử từ khóa khác.' : 'Nhập tên phim để bắt đầu tìm kiếm.'}
                </div>
            )}
        </div>
    );
}
