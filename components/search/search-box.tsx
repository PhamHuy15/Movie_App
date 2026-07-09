'use client';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
type Suggestion = { id: number; slug: string; title: string; year: number };
export function SearchBox({ compact = false, initial = '' }: { compact?: boolean; initial?: string }) {
    const [q, setQ] = useState(initial);
    const [items, setItems] = useState<Suggestion[]>([]);
    const r = useRouter();
    useEffect(() => {
        if (q.trim().length < 2) return;
        const controller = new AbortController();
        const id = setTimeout(
            () =>
                fetch(`/api/movies?q=${encodeURIComponent(q)}`, { signal: controller.signal })
                    .then((x) => x.json())
                    .then((x) => setItems((x.data ?? []).slice(0, 5)))
                    .catch(() => {}),
            300,
        );
        return () => {
            clearTimeout(id);
            controller.abort();
        };
    }, [q]);
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (q.trim()) r.push(`/search?q=${encodeURIComponent(q.trim())}`);
            }}
            className="relative"
        >
            <Search className="absolute top-1/2 left-4 z-10 -translate-y-1/2 text-white/60" size={17} />
            <input
                value={q}
                onChange={(e) => {
                    setQ(e.target.value);
                    if (e.target.value.trim().length < 2) setItems([]);
                }}
                aria-label="Tìm kiếm phim, diễn viên"
                autoComplete="off"
                placeholder="Tìm kiếm phim, diễn viên..."
                className={cn(
                    'focus:border-brand/60 w-full rounded-full border border-white/10 bg-white/8 py-3 pr-10 pl-11 text-sm transition outline-none focus:bg-black/60',
                    compact && 'py-2',
                )}
            />
            {q && (
                <button
                    type="button"
                    onClick={() => {
                        setQ('');
                        setItems([]);
                    }}
                    aria-label="Xóa tìm kiếm"
                    className="absolute top-1/2 right-3 -translate-y-1/2"
                >
                    <X size={16} />
                </button>
            )}
            {items.length > 0 && (
                <div className="absolute top-[calc(100%+.5rem)] w-full overflow-hidden rounded-xl border border-white/10 bg-[#141516] p-2 shadow-2xl">
                    {items.map((x) => (
                        <Link
                            onClick={() => setItems([])}
                            href={`/movie/${x.slug}`}
                            key={x.id}
                            className="flex justify-between rounded-lg px-3 py-2 text-sm hover:bg-white/8"
                        >
                            <span>{x.title}</span>
                            <span className="text-white/60">{x.year}</span>
                        </Link>
                    ))}
                </div>
            )}
        </form>
    );
}
