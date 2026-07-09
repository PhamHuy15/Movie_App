'use client';

import { Heart } from 'lucide-react';
import { useLibraryStore } from '@/store/library-store';
import type { Movie } from '@/types/movie';

export function FavoriteButton({ movie }: { movie: Movie }) {
    const { favorites, toggleFavorite } = useLibraryStore();
    const on = favorites.some((item) => item.movieId === movie.id);

    return (
        <button
            type="button"
            onClick={() => toggleFavorite(movie)}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-white/10 px-5 font-semibold"
        >
            <Heart size={18} className={on ? 'fill-brand text-brand' : ''} />
            {on ? 'Đã yêu thích' : 'Yêu thích'}
        </button>
    );
}
