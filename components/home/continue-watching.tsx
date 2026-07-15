'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, X } from 'lucide-react';
import { useLibraryStore } from '@/store/library-store';

export function ContinueWatching() {
    const history = useLibraryStore((state) => state.history);
    const removeHistory = useLibraryStore((state) => state.removeHistory);
    if (!history.length) return null;
    return (
        <section className="py-7">
            <div className="mb-5 flex items-end gap-2 px-5 lg:px-10">
                <Clock className="text-brand" size={18} />
                <h2 className="font-display text-2xl font-bold">Tiếp tục xem</h2>
            </div>
            <div className="grid auto-cols-[72%] grid-flow-col gap-4 overflow-x-auto px-5 pb-3 sm:auto-cols-[38%] md:auto-cols-[28%] lg:auto-cols-[23%] lg:px-10">
                {history.slice(0, 12).map((item) => {
                    const progress = Math.min(100, (item.progress / Math.max(item.duration, 1)) * 100);
                    return (
                        <article key={item.movieId} className="relative overflow-hidden rounded-xl bg-white/5">
                            <Link href={`/watch/${item.slug}`} className="flex gap-3 p-3">
                                <div className="relative aspect-[2/3] w-20 shrink-0 overflow-hidden rounded-lg">
                                    <Image src={item.posterUrl} alt={item.title} fill quality={85} sizes="80px" className="object-cover" />
                                </div>
                                <div className="min-w-0 self-center">
                                    <h3 className="line-clamp-2 font-semibold">{item.title}</h3>
                                    <p className="mt-2 text-xs text-white/50">{item.episode ? `Tập ${item.episode}` : 'Đang xem'}</p>
                                </div>
                            </Link>
                            <button aria-label={`Xóa ${item.title} khỏi lịch sử`} onClick={() => removeHistory(item.movieId)} className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-black/60 text-white/70 hover:text-white">
                                <X size={14} />
                            </button>
                            <div className="h-1 bg-white/10"><div className="bg-brand h-full" style={{ width: `${progress}%` }} /></div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
