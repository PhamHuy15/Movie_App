import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationBarProps {
    currentPage: number;
    totalPages: number;
    buildHref: (page: number) => string;
}

export function PaginationBar({ currentPage, totalPages, buildHref }: PaginationBarProps) {
    if (totalPages <= 1) return null;

    const maxVisible = 7;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    const pages: (number | '...')[] = [];
    if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
    }
    for (let page = start; page <= end; page += 1) pages.push(page);
    if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
    }

    return (
        <nav aria-label="Phân trang" className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
            {currentPage > 1 && (
                <Link
                    href={buildHref(currentPage - 1)}
                    aria-label="Trang trước"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/8 text-white/70 transition hover:bg-white/15 hover:text-white"
                >
                    <ChevronLeft size={16} />
                </Link>
            )}

            {pages.map((page, index) =>
                page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-1 text-white/30 select-none">
                        ...
                    </span>
                ) : (
                    <Link
                        key={page}
                        href={buildHref(page)}
                        aria-current={page === currentPage ? 'page' : undefined}
                        className={`flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
                            page === currentPage
                                ? 'bg-brand text-black'
                                : 'bg-white/8 text-white/70 hover:bg-white/15 hover:text-white'
                        }`}
                    >
                        {page}
                    </Link>
                ),
            )}

            {currentPage < totalPages && (
                <Link
                    href={buildHref(currentPage + 1)}
                    aria-label="Trang sau"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/8 text-white/70 transition hover:bg-white/15 hover:text-white"
                >
                    <ChevronRight size={16} />
                </Link>
            )}
        </nav>
    );
}
