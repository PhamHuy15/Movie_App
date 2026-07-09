'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Heart } from 'lucide-react';
import { useLibraryStore } from '@/store/library-store';
export function LibraryView({ mode }: { mode: 'favorites' | 'history' }) {
    const favorites = useLibraryStore((s) => s.favorites);
    const history = useLibraryStore((s) => s.history);
    const items = mode === 'favorites' ? favorites : history;
    return (
        <div className="px-5 pt-24 pb-16 lg:px-10">
            <div className="flex items-center gap-3">
                {mode === 'favorites' ? <Heart className="text-brand" /> : <Clock className="text-brand" />}
                <h1 className="text-3xl font-black">{mode === 'favorites' ? 'Thư viện của tôi' : 'Lịch sử xem'}</h1>
            </div>
            {items.length ? (
                <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                    {items.map((x) => (
                        <Link href={`/movie/${x.slug}`} key={x.movieId}>
                            <div className="relative aspect-[2/3] overflow-hidden rounded-xl">
                                <Image src={x.posterUrl} alt={x.title} fill className="object-cover" />
                            </div>
                            <b className="mt-2 block">{x.title}</b>
                            {'progress' in x && (
                                <div className="mt-2 h-1 overflow-hidden rounded bg-white/10">
                                    <div
                                        className="bg-brand h-full"
                                        style={{
                                            width: `${Math.min(100, (x.progress / Math.max(x.duration, 1)) * 100)}%`,
                                        }}
                                    />
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="mt-10 rounded-2xl border border-dashed border-white/10 p-16 text-center text-white/45">
                    Danh sách đang trống. Hãy khám phá và thêm bộ phim đầu tiên.
                </div>
            )}
        </div>
    );
}
