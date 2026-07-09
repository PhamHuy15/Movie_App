'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Movie } from '@/types/movie';
import { useLibraryStore } from '@/store/library-store';
export function MovieCard({ movie }: { movie: Movie }) {
    const { favorites, toggleFavorite } = useLibraryStore();
    const liked = favorites.some((f) => f.movieId === movie.id);
    return (
        <motion.article whileHover={{ y: -6 }} className="group relative min-w-[145px] md:min-w-0">
            <Link href={`/movie/${movie.slug}`} className="block">
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-white/5">
                    <Image
                        src={movie.posterUrl}
                        alt={`Poster ${movie.title}`}
                        fill
                        sizes="(max-width: 768px) 42vw, 16vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/45">
                        <span className="bg-brand grid size-12 scale-75 place-items-center rounded-full text-black opacity-0 transition group-hover:scale-100 group-hover:opacity-100">
                            <Play fill="currentColor" size={20} />
                        </span>
                    </div>
                    <span className="bg-brand absolute top-2 left-2 rounded px-2 py-1 text-[10px] font-bold text-black">
                        {movie.quality}
                    </span>
                    {movie.latestEpisode && (
                        <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-1 text-[10px] font-medium">
                            {movie.latestEpisode}
                        </span>
                    )}
                </div>
                <h3 className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 font-semibold md:text-[15px]">
                    {movie.title}
                </h3>
                <div className="mt-1 flex gap-2 text-xs font-medium text-white/55">
                    <span>{movie.year}</span>
                    <span className="text-amber-400">★ {movie.rating.toFixed(1)}</span>
                </div>
            </Link>
            <button
                onClick={() => toggleFavorite(movie)}
                aria-label={liked ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
                className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-black/60 opacity-100 backdrop-blur md:opacity-0 md:group-hover:opacity-100"
            >
                <Heart size={15} className={liked ? 'fill-brand text-brand' : ''} />
            </button>
        </motion.article>
    );
}
