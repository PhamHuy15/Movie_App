'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Clapperboard,
    Compass,
    Flame,
    Globe,
    History,
    Home,
    Library,
    Play,
    Tv,
    Users,
    WandSparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
    ['Trang chủ', '/', Home],
    ['Phim mới', '/movies', Flame],
    ['Phim bộ', '/series', Play],
    ['Phim lẻ', '/single-movies', Clapperboard],
    ['Hoạt hình', '/animation', WandSparkles],
    ['TV Shows', '/tv-shows', Tv],
    ['Phim Hàn', '/country/han-quoc', Globe],
    ['Phim Trung', '/country/trung-quoc', Globe],
    ['Khám phá', '/discover', Compass],
    ['Xem chung', '/watch-party', Users],
    ['Thư viện', '/library', Library],
    ['Lịch sử', '/history', History],
] as const;

export function DesktopSidebar() {
    const pathname = usePathname();
    return (
        <aside className="fixed inset-y-0 left-0 z-[60] hidden w-20 border-r border-white/5 bg-[#0c0d0e] md:flex md:flex-col xl:w-56">
            <Link
                href="/"
                className="flex h-16 shrink-0 items-center justify-center text-xl font-black xl:justify-start xl:px-7"
            >
                <span className="text-brand">C</span>
                <span className="hidden xl:inline">INEVA</span>
            </Link>

            <nav className="flex-1 scrollbar-none space-y-0.5 overflow-y-auto px-2 pb-4 xl:px-3">
                {items.map(([label, href, Icon]) => {
                    const active = pathname === href;
                    return (
                        <Link
                            key={label}
                            href={href}
                            className={cn(
                                'flex h-10 items-center justify-center gap-3 rounded-xl text-sm transition hover:bg-white/5 hover:text-white xl:justify-start xl:px-4',
                                active ? 'bg-brand/10 text-brand' : 'text-white/50',
                            )}
                        >
                            <Icon size={18} />
                            <span className="hidden xl:inline">{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
