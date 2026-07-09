import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clapperboard, Globe2, Play, Share2, Star } from 'lucide-react';
import { notFound } from 'next/navigation';
import { MovieSection } from '@/components/home/movie-section';
import { FavoriteButton } from '@/components/movie/favorite-button';
import { movieCatalogService } from '@/services/movie-catalog.service';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const movie = await movieCatalogService.detail((await params).slug);
    if (!movie) return {};

    return {
        title: `${movie.title} - Cineva`,
        description: movie.overview || `Xem phim ${movie.title} online`,
        openGraph: { images: [movie.backdropUrl || movie.posterUrl] },
    };
}

export default async function Page({ params }: PageProps) {
    const slug = (await params).slug;
    const movie = await movieCatalogService.detail(slug);
    if (!movie) notFound();

    const relatedKeyword = movie.genres[0]?.name || movie.country.name;
    const relatedResult = relatedKeyword ? await movieCatalogService.listBySearch(relatedKeyword, 1) : null;
    const related = relatedResult?.movies.filter((item) => item.slug !== movie.slug).slice(0, 12) ?? [];
    const hasEpisodes = movie.seasons.some((season) => season.episodes.length > 0);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': movie.type === 'series' ? 'TVSeries' : 'Movie',
        name: movie.title,
        dateCreated: String(movie.year),
        description: movie.overview,
        image: movie.posterUrl,
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <section className="relative min-h-[75vh] pt-28">
                <Image
                    src={movie.backdropUrl}
                    alt=""
                    fill
                    priority
                    className="object-cover object-top opacity-30"
                    unoptimized
                />
                <div className="from-ink via-ink/50 absolute inset-0 bg-gradient-to-t to-black/20" />
                <div className="from-ink/80 absolute inset-0 bg-gradient-to-r to-transparent" />

                <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-5 pb-16 md:flex-row md:items-end lg:px-10">
                    <div className="relative aspect-[2/3] w-40 shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 md:w-60">
                        <Image
                            src={movie.posterUrl}
                            alt={`Poster ${movie.title}`}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>

                    <div className="max-w-3xl">
                        <div className="flex flex-wrap gap-2">
                            {movie.quality && (
                                <span className="bg-brand rounded-full px-3 py-1 text-xs font-bold text-black">
                                    {movie.quality}
                                </span>
                            )}
                            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium">
                                {movie.type === 'series' ? 'Phim bộ' : 'Phim lẻ'}
                            </span>
                            {movie.latestEpisode && (
                                <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium">
                                    {movie.latestEpisode}
                                </span>
                            )}
                        </div>

                        <h1 className="font-display mt-4 line-clamp-3 text-[clamp(2rem,6vw,5rem)] leading-[1.06] font-bold">
                            {movie.title}
                        </h1>
                        {movie.originalTitle !== movie.title && (
                            <p className="mt-1 text-base font-medium text-white/50">{movie.originalTitle}</p>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-white/60">
                            {movie.rating > 0 && (
                                <span className="flex items-center gap-1 text-amber-400">
                                    <Star size={14} fill="currentColor" /> {movie.rating.toFixed(1)}
                                </span>
                            )}
                            {movie.year > 0 && (
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} /> {movie.year}
                                </span>
                            )}
                            {movie.country.name !== 'Đang cập nhật' && (
                                <span className="flex items-center gap-1">
                                    <Globe2 size={14} /> {movie.country.name}
                                </span>
                            )}
                            {movie.runtime > 0 && (
                                <span className="flex items-center gap-1">
                                    <Clapperboard size={14} /> {movie.runtime} phút
                                </span>
                            )}
                            <span className="text-white/40">{movie.status}</span>
                        </div>

                        {movie.genres.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {movie.genres.map((genre) => (
                                    <span
                                        key={genre.id}
                                        className="rounded-full bg-white/8 px-3 py-1 text-xs font-medium"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {movie.overview && <p className="mt-5 max-w-2xl leading-7 text-white/70">{movie.overview}</p>}

                        {movie.director && (
                            <p className="mt-3 text-sm text-white/50">
                                Đạo diễn: <span className="font-semibold text-white">{movie.director}</span>
                            </p>
                        )}

                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link
                                href={`/watch/${movie.slug}`}
                                className="bg-brand inline-flex h-12 items-center gap-2 rounded-full px-7 font-semibold text-black transition hover:brightness-110"
                            >
                                <Play size={18} fill="currentColor" />
                                {hasEpisodes ? 'Xem phim' : 'Kiểm tra nguồn phát'}
                            </Link>
                            <FavoriteButton movie={movie} />
                            <button
                                aria-label="Chia sẻ"
                                className="grid size-12 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
                            >
                                <Share2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {movie.credits.length > 0 && (
                <section className="px-5 py-8 lg:px-10">
                    <h2 className="font-display text-xl font-bold">Diễn viên</h2>
                    <div className="mt-4 flex flex-wrap gap-3">
                        {movie.credits.map((credit) => (
                            <div
                                key={credit.id}
                                className="rounded-xl bg-white/5 px-4 py-3 transition hover:bg-white/8"
                            >
                                <p className="text-sm font-semibold">{credit.name}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {related.length > 0 && <MovieSection title="Có thể bạn sẽ thích" movies={related} />}
        </>
    );
}
