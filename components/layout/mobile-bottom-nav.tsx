'use client';
import Link from 'next/link';
import { Compass, Home, Library, Search, UserRound } from 'lucide-react';
export function MobileBottomNav() {
    return (
        <nav className="bg-ink/95 fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-white/10 backdrop-blur md:hidden">
            {[
                [Home, 'Trang chủ', '/'],
                [Compass, 'Khám phá', '/discover'],
                [Search, 'Tìm kiếm', '/search'],
                [Library, 'Thư viện', '/library'],
                [UserRound, 'Tài khoản', '/account'],
            ].map(([Icon, label, href]) => (
                <Link
                    key={String(label)}
                    href={String(href)}
                    className="hover:text-brand flex flex-col items-center gap-1 text-[10px] text-white/60"
                >
                    <Icon size={20} />
                    {String(label)}
                </Link>
            ))}
        </nav>
    );
}
