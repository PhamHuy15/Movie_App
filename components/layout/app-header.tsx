'use client';
import Link from 'next/link';
import { Bell, Search, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { SearchBox } from '@/components/search/search-box';

const NAV_LINKS = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Phim mới', href: '/movies' },
    { label: 'Phim bộ', href: '/series' },
    { label: 'Phim lẻ', href: '/single-movies' },
    { label: 'Hoạt hình', href: '/animation' },
    { label: 'TV Shows', href: '/tv-shows' },
    { label: 'Phim Hàn', href: '/country/han-quoc' },
    { label: 'Phim Trung', href: '/country/trung-quoc' },
    { label: 'Khám phá', href: '/discover' },
    { label: 'Lịch chiếu', href: '/showtimes' },
];

export function AppHeader() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const f = () => setScrolled(scrollY > 20);
        addEventListener('scroll', f, { passive: true });
        return () => removeEventListener('scroll', f);
    }, []);

    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 z-50 flex h-16 items-center gap-5 px-4 transition md:left-20 xl:left-56 xl:px-8',
                scrolled && 'bg-ink/85 border-b border-white/5 backdrop-blur-xl',
            )}
        >
            <Link href="/" className="mr-auto text-2xl font-black tracking-tight md:hidden">
                <span className="text-brand">C</span>INEVA
            </Link>

            <nav className="hidden items-center gap-4 text-sm text-white/70 lg:flex">
                {NAV_LINKS.map(({ label, href }) => (
                    <Link key={label} href={href} className="transition-colors hover:text-white">
                        {label}
                    </Link>
                ))}
            </nav>

            <div className="hidden w-64 md:block">
                <SearchBox compact />
            </div>
            <Link href="/search" aria-label="Tìm kiếm" className="md:hidden">
                <Search size={21} />
            </Link>
            <button aria-label="Thông báo" className="hidden text-white/70 hover:text-white sm:block">
                <Bell size={20} />
            </button>
            <Link
                href="/login"
                aria-label="Đăng nhập"
                className="grid size-9 place-items-center rounded-full bg-white/10"
            >
                <UserRound size={18} />
            </Link>
        </header>
    );
}
