'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import type { Movie } from '@/types/movie';
import { MovieCard } from '@/components/movie/movie-card';
export function MovieSection({ title, movies }: { title: string; movies: Movie[] }) {
    const ref = useRef<HTMLDivElement>(null);
    const move = (n: number) => ref.current?.scrollBy({ left: n * ref.current.clientWidth * 0.8, behavior: 'smooth' });
    return (
        <section className="py-7">
            <div className="mb-5 flex items-end justify-between px-5 lg:px-10">
                <div>
                    <p className="text-brand mb-1 text-xs font-semibold tracking-[.18em] uppercase">Cineva selection</p>
                    <h2 className="font-display text-[clamp(1.25rem,2vw,2rem)] leading-[1.15] font-bold tracking-[-.01em]">
                        {title}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/movies" className="hover:text-brand mr-2 text-xs font-medium text-white/50">
                        Xem tất cả
                    </Link>
                    <button
                        onClick={() => move(-1)}
                        aria-label="Cuộn trái"
                        className="grid size-8 place-items-center rounded-full border border-white/10"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => move(1)}
                        aria-label="Cuộn phải"
                        className="grid size-8 place-items-center rounded-full border border-white/10"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
            <div
                ref={ref}
                className="hide-scrollbar grid auto-cols-[42%] grid-flow-col gap-4 overflow-x-auto px-5 pb-3 sm:auto-cols-[29%] md:auto-cols-[22%] lg:auto-cols-[17%] lg:px-10 xl:auto-cols-[15%]"
            >
                {movies.map((m, i) => (
                    <MovieCard key={`${m.id}-${i}`} movie={m} />
                ))}
            </div>
        </section>
    );
}
