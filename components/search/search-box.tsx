'use client';

import Image from 'next/image';
import { LoaderCircle, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Suggestion = {
    id: number;
    slug: string;
    title: string;
    originalTitle?: string;
    year: number;
    posterUrl?: string;
    latestEpisode?: string;
};

export function SearchBox({ compact = false, initial = '' }: { compact?: boolean; initial?: string }) {
    const [query, setQuery] = useState(initial);
    const [items, setItems] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [searched, setSearched] = useState(false);
    const dismissedRef = useRef(false);
    const router = useRouter();

    useEffect(() => {
        const keyword = query.trim();
        if (keyword.length < 2) return;
        const controller = new AbortController();
        const id = window.setTimeout(async () => {
            setLoading(true);
            if (!dismissedRef.current) setOpen(true);
            try {
                const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(keyword)}`, { signal: controller.signal });
                const payload = await response.json();
                setItems(Array.isArray(payload.data) ? payload.data : []);
                setSearched(true);
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    setItems([]);
                    setSearched(true);
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }, 300);
        return () => {
            window.clearTimeout(id);
            controller.abort();
        };
    }, [query]);

    const submit = () => {
        const keyword = query.trim();
        if (!keyword) return;
        dismissedRef.current = true;
        setOpen(false);
        router.push(`/search?q=${encodeURIComponent(keyword)}`);
    };

    return (
        <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="relative z-[70]" onFocus={() => { dismissedRef.current = false; if (query.trim().length >= 2) setOpen(true); }} onBlur={() => window.setTimeout(() => setOpen(false), 120)}>
            <Search className="absolute top-1/2 left-4 z-10 -translate-y-1/2 text-white/60" size={17} />
            <input
                value={query}
                onChange={(event) => {
                    const value = event.target.value;
                    dismissedRef.current = false;
                    setQuery(value);
                    if (value.trim().length < 2) {
                        setItems([]);
                        setLoading(false);
                        setSearched(false);
                        setOpen(false);
                    }
                }}
                onKeyDown={(event) => { if (event.key === 'Escape') { dismissedRef.current = true; setOpen(false); } }}
                aria-label="Tìm kiếm phim, diễn viên"
                role="combobox"
                aria-expanded={open}
                aria-controls="search-suggestions"
                autoComplete="off"
                placeholder="Tìm kiếm phim, diễn viên..."
                className={cn('focus:border-brand/60 w-full rounded-full border border-white/10 bg-white/8 py-3 pr-10 pl-11 text-sm transition outline-none focus:bg-black/70', compact && 'py-2')}
            />
            {loading ? <LoaderCircle aria-label="Đang tìm kiếm" className="absolute top-1/2 right-3 -translate-y-1/2 animate-spin text-white/60" size={16} /> : query && <button type="button" onClick={() => { setQuery(''); setItems([]); setOpen(false); }} aria-label="Xóa tìm kiếm" className="absolute top-1/2 right-3 -translate-y-1/2"><X size={16} /></button>}

            {open && query.trim().length >= 2 && (
                <div id="search-suggestions" className="absolute top-[calc(100%+.5rem)] z-[80] w-full min-w-[300px] overflow-hidden rounded-2xl border border-white/10 bg-[#141516]/98 p-2 shadow-2xl backdrop-blur-xl">
                    {items.map((item) => (
                        <Link onMouseDown={(event) => event.preventDefault()} onClick={() => setOpen(false)} href={`/movie/${item.slug}`} key={item.slug} className="flex items-center gap-3 rounded-xl p-2 text-sm hover:bg-white/8">
                            {item.posterUrl && <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md bg-white/5"><Image src={item.posterUrl} alt="" fill quality={85} sizes="40px" className="object-cover" /></div>}
                            <span className="min-w-0 flex-1"><strong className="line-clamp-1 block">{item.title}</strong>{item.originalTitle && item.originalTitle !== item.title && <small className="line-clamp-1 block text-white/45">{item.originalTitle}</small>}</span>
                            <span className="shrink-0 text-xs text-white/50">{item.latestEpisode ?? item.year}</span>
                        </Link>
                    ))}
                    {!loading && searched && items.length === 0 && <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={submit} className="w-full rounded-xl px-4 py-4 text-left text-sm text-white/55 hover:bg-white/8">Không có gợi ý nhanh. Xem toàn bộ kết quả cho “{query.trim()}”</button>}
                    {items.length > 0 && <button type="submit" onMouseDown={(event) => event.preventDefault()} className="text-brand mt-1 w-full rounded-xl px-3 py-2 text-left text-xs font-semibold hover:bg-white/8">Xem tất cả kết quả cho “{query.trim()}”</button>}
                </div>
            )}
        </form>
    );
}
