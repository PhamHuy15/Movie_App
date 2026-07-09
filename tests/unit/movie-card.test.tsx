import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MovieCard } from '@/components/movie/movie-card';
import { fixtureMovie } from '@/tests/fixtures/movies';

vi.mock('next/image', () => ({ default: ({ alt }: { alt: string }) => <div role="img" aria-label={alt} /> }));
vi.mock('framer-motion', () => ({
    motion: {
        article: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
            <article {...props}>{children}</article>
        ),
    },
}));

describe('MovieCard', () => {
    it('render đúng title, rating và giới hạn hai dòng', () => {
        render(<MovieCard movie={fixtureMovie} />);
        const title = screen.getByRole('heading', { name: fixtureMovie.title });
        expect(title).toHaveClass('line-clamp-2');
        expect(screen.getByText('★ 8.6')).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('href', '/movie/phim-qa');
    });
});
