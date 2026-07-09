import Link from 'next/link';
import { movieCatalogService } from '@/services/movie-catalog.service';

export default async function Page() {
    const result = await movieCatalogService.listByCategory('dang-chieu', 1);
    const movies = result.movies.slice(0, 10);

    return (
        <div className="px-5 pt-24 pb-16 lg:px-10">
            <h1 className="text-4xl font-black">Đang chiếu</h1>
            <p className="mt-2 text-white/45">Nội dung đang được cập nhật từ NguonC</p>
            {movies.length ? (
                <div className="mt-8 space-y-3">
                    {movies.map((movie) => (
                        <Link
                            href={`/movie/${movie.slug}`}
                            key={movie.slug}
                            className="flex items-center gap-5 rounded-2xl bg-white/[.04] p-5 hover:bg-white/[.07]"
                        >
                            <span className="min-w-20 text-center text-xs text-white/40">
                                {movie.year}
                                <b className="block text-lg text-white">{movie.quality ?? 'HD'}</b>
                            </span>
                            <div>
                                <b>{movie.title}</b>
                                <p className="text-sm text-white/45">
                                    {[movie.country.name, movie.genres[0]?.name].filter(Boolean).join(' · ')}
                                </p>
                            </div>
                            {movie.latestEpisode && (
                                <span className="bg-brand/10 text-brand ml-auto rounded-full px-3 py-1 text-xs">
                                    {movie.latestEpisode}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="mt-10 rounded-2xl border border-dashed border-white/10 p-12 text-center text-white/45">
                    Chưa có dữ liệu đang chiếu từ NguonC.
                </div>
            )}
        </div>
    );
}
