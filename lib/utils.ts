import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Movie } from '@/types/movie';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function imageUrl(path: string | null | undefined) {
    if (!path) return '/placeholder.svg';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return path.startsWith('/') ? path : `/${path}`;
}

export function uniqueMovies(movies: Movie[], excluded: Iterable<string> = []) {
    const seen = new Set(excluded);
    return movies.filter((movie) => {
        if (!movie.slug || seen.has(movie.slug)) return false;
        seen.add(movie.slug);
        return true;
    });
}
