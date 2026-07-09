'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Info, Play, Volume2, VolumeX } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Movie } from '@/types/movie';
export function HeroCarousel({ movies }: { movies: Movie[] }) {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const [muted, setMuted] = useState(true);
    useEffect(() => {
        if (paused || movies.length < 2) return;
        const id = setInterval(() => setActive((v) => (v + 1) % movies.length), 6500);
        return () => clearInterval(id);
    }, [paused, movies.length]);
    const m = movies[active];
    if (!m) return null;
    return (
        <section
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="relative h-[64vh] min-h-[520px] overflow-hidden md:h-[72vh]"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={m.id}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.65 }}
                    className="absolute inset-0"
                >
                    <Image src={m.backdropUrl} alt="" fill priority sizes="100vw" className="object-cover" />
                </motion.div>
            </AnimatePresence>
            <div className="from-ink via-ink/65 absolute inset-0 bg-gradient-to-r to-transparent" />
            <div className="from-ink absolute inset-0 bg-gradient-to-t via-transparent to-black/30" />
            <div className="relative flex h-full max-w-3xl flex-col justify-end px-5 pt-24 pb-20 lg:px-10 lg:pb-24">
                <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <span className="bg-brand rounded-full px-3 py-1 text-xs font-bold text-black">
                        TOP 10 · Nổi bật
                    </span>
                    <h1 className="font-display mt-5 line-clamp-2 text-[clamp(2.5rem,7vw,7rem)] leading-[1.05] font-bold tracking-[-.02em]">
                        {m.title}
                    </h1>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-medium text-white/70">
                        <span className="text-brand">★ {m.rating.toFixed(1)}</span>
                        <span>{m.year}</span>
                        <span>{m.country.name}</span>
                        <span>{m.type === 'series' ? 'Phim bộ' : 'Phim lẻ'}</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                        {m.genres.map((g) => (
                            <span
                                key={g.id}
                                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium"
                            >
                                {g.name}
                            </span>
                        ))}
                    </div>
                    <p className="mt-5 line-clamp-3 max-w-xl text-[15px] leading-6 text-white/65 md:text-base">
                        {m.overview}
                    </p>
                    <div className="mt-7 flex gap-3">
                        <Link
                            href={`/watch/${m.slug}`}
                            className="bg-brand inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold text-black"
                        >
                            <Play fill="currentColor" size={18} />
                            Xem ngay
                        </Link>
                        <Link
                            href={`/movie/${m.slug}`}
                            className="inline-flex h-12 items-center gap-2 rounded-full bg-white/10 px-5 font-medium backdrop-blur"
                        >
                            <Info size={18} />
                            Chi tiết
                        </Link>
                    </div>
                </motion.div>
            </div>
            <button
                onClick={() => setMuted(!muted)}
                aria-label={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                className="absolute right-5 bottom-20 grid size-11 place-items-center rounded-full border border-white/20 bg-black/30 backdrop-blur lg:right-10"
            >
                {muted ? <VolumeX /> : <Volume2 />}
            </button>
            <div className="absolute right-5 bottom-8 flex gap-2 lg:right-10">
                {movies.map((x, i) => (
                    <button
                        key={x.id}
                        onClick={() => setActive(i)}
                        aria-label={`Slide ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all ${i === active ? 'bg-brand w-8' : 'w-2 bg-white/35'}`}
                    />
                ))}
            </div>
        </section>
    );
}
