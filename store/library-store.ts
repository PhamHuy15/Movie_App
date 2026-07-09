'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FavoriteMovie, Movie, WatchHistory } from '@/types/movie';
interface LibraryState {
    favorites: FavoriteMovie[];
    history: WatchHistory[];
    toggleFavorite: (m: Movie) => void;
    saveProgress: (m: Movie, progress: number, duration: number) => void;
}
export const useLibraryStore = create<LibraryState>()(
    persist(
        (set) => ({
            favorites: [],
            history: [],
            toggleFavorite: (m) =>
                set((s) => ({
                    favorites: s.favorites.some((x) => x.movieId === m.id)
                        ? s.favorites.filter((x) => x.movieId !== m.id)
                        : [
                              ...s.favorites,
                              {
                                  movieId: m.id,
                                  slug: m.slug,
                                  title: m.title,
                                  posterUrl: m.posterUrl,
                                  addedAt: new Date().toISOString(),
                              },
                          ],
                })),
            saveProgress: (m, progress, duration) =>
                set((s) => ({
                    history: [
                        {
                            movieId: m.id,
                            slug: m.slug,
                            title: m.title,
                            posterUrl: m.posterUrl,
                            progress,
                            duration,
                            updatedAt: new Date().toISOString(),
                        },
                        ...s.history.filter((x) => x.movieId !== m.id),
                    ].slice(0, 50),
                })),
        }),
        { name: 'cineva-library' },
    ),
);
