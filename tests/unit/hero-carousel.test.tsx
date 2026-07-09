import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HeroCarousel } from '@/components/home/hero-carousel';
import { fixtureMovie } from '@/tests/fixtures/movies';

vi.mock('next/image', () => ({
    default: ({ alt }: { alt: string }) => <div role="img" aria-label={alt || 'backdrop'} />,
}));
vi.mock('framer-motion', () => ({
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    motion: new Proxy(
        {},
        {
            get:
                (_target, tag: string) =>
                ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => {
                    const Element = tag as React.ElementType;
                    return <Element {...props}>{children}</Element>;
                },
        },
    ),
}));

describe('HeroCarousel', () => {
    it('tự chuyển slide sau 6.5 giây', async () => {
        vi.useFakeTimers();
        const second = { ...fixtureMovie, id: 102, slug: 'phim-2', title: 'Phim Kế Tiếp' };
        render(<HeroCarousel movies={[fixtureMovie, second]} />);
        expect(screen.getByRole('heading', { name: fixtureMovie.title })).toBeVisible();
        await act(async () => {
            vi.advanceTimersByTime(6500);
        });
        expect(screen.getByRole('heading', { name: second.title })).toBeVisible();
        vi.useRealTimers();
    });
});
