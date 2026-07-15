'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Info, Pause, Play } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import type { Movie } from '@/types/movie';
import { uniqueMovies } from '@/lib/utils';

export function HeroCarousel({ movies }: { movies: Movie[] }) {
    const slides = useMemo(() => uniqueMovies(movies), [movies]);
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused || slides.length < 2) return;
        const id = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 5500);
        return () => window.clearInterval(id);
    }, [paused, slides.length]);

    const go = (direction: number) => {
        setActive((value) => (value + direction + slides.length) % slides.length);
    };
    const safeActive = active % Math.max(slides.length, 1);
    const movie = slides[safeActive];
    if (!movie) return null;

    return (
        <section aria-roledescription="carousel" aria-label="Phim nổi bật" className="relative h-[68vh] min-h-[540px] overflow-hidden md:h-[78vh]">
            <AnimatePresence mode="sync" initial={false}>
                <motion.div
                    key={movie.slug}
                    initial={{ opacity: 0, scale: 1.035 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute inset-0"
                >
                    <Image
                        src={movie.backdropUrl || movie.posterUrl}
                        alt=""
                        fill
                        preload={safeActive === 0}
                        quality={90}
                        sizes="100vw"
                        className="object-cover object-center"
                    />
                </motion.div>
            </AnimatePresence>
            <div className="from-ink via-ink/55 absolute inset-0 bg-gradient-to-r to-black/5" />
            <div className="from-ink absolute inset-0 bg-gradient-to-t via-transparent to-black/30" />

            <div className="relative flex h-full max-w-4xl flex-col justify-end px-5 pt-24 pb-24 lg:px-10 lg:pb-28">
                <motion.div key={movie.slug} initial={{ y: 24 }} animate={{ y: 0 }} transition={{ duration: 0.45 }}>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black">NỔI BẬT · MỚI CẬP NHẬT</span>
                    <h1 className="font-display mt-5 line-clamp-2 text-[clamp(2.6rem,7vw,6.5rem)] leading-[1.02] font-bold tracking-[-.02em]">{movie.title}</h1>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-medium text-white/75">
                        {movie.rating > 0 && <span className="text-brand">★ {movie.rating.toFixed(1)}</span>}
                        <span>{movie.year}</span>
                        <span>{movie.country.name}</span>
                        <span>{movie.type === 'series' ? 'Phim bộ' : 'Phim lẻ'}</span>
                        {movie.latestEpisode && <span>{movie.latestEpisode}</span>}
                    </div>
                    {movie.genres.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{movie.genres.slice(0, 4).map((genre) => <span key={`${genre.id}-${genre.name}`} className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs font-medium">{genre.name}</span>)}</div>}
                    {movie.overview && <p className="mt-5 line-clamp-3 max-w-2xl text-[15px] leading-6 text-white/70 md:text-base">{movie.overview}</p>}
                    <div className="mt-7 flex flex-wrap gap-3">
                        <Link href={`/watch/${movie.slug}`} className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-black transition hover:brightness-90"><Play fill="currentColor" size={18} />Xem ngay</Link>
                        <Link href={`/movie/${movie.slug}`} className="inline-flex h-12 items-center gap-2 rounded-full bg-white/12 px-5 font-medium backdrop-blur transition hover:bg-white/20"><Info size={18} />Chi tiết</Link>
                    </div>
                </motion.div>
            </div>

            {slides.length > 1 && <div className="absolute right-5 bottom-8 flex items-center gap-2 lg:right-10">
                <button onClick={() => go(-1)} aria-label="Banner trước" className="grid size-10 place-items-center rounded-full border border-white/15 bg-black/35 backdrop-blur hover:bg-black/60"><ChevronLeft size={19} /></button>
                <button onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Tiếp tục banner' : 'Tạm dừng banner'} className="grid size-10 place-items-center rounded-full border border-white/15 bg-black/35 backdrop-blur hover:bg-black/60">{paused ? <Play size={17} fill="currentColor" /> : <Pause size={17} fill="currentColor" />}</button>
                <button onClick={() => go(1)} aria-label="Banner tiếp theo" className="grid size-10 place-items-center rounded-full border border-white/15 bg-black/35 backdrop-blur hover:bg-black/60"><ChevronRight size={19} /></button>
            </div>}
            <div className="absolute bottom-8 left-5 flex gap-2 lg:left-10">
                {slides.map((slide, index) => <button key={slide.slug} onClick={() => setActive(index)} aria-label={`Banner ${index + 1}: ${slide.title}`} aria-current={index === safeActive ? 'true' : undefined} className={`h-1.5 rounded-full transition-all ${index === safeActive ? 'bg-brand w-9' : 'w-3 bg-white/35 hover:bg-white/60'}`} />)}
            </div>
        </section>
    );
}
