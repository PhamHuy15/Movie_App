'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FavoriteMovie, Movie, WatchHistory } from '@/types/movie';
import { normalizeLegacyNguoncPosterUrl } from '@/lib/movie-images';
const syncFavorite = (movie: Movie, active: boolean) => {
    if (typeof window === 'undefined') return;
    void fetch(active ? '/api/library/favorites' : `/api/library/favorites/${movie.id}`, {
        method: active ? 'POST' : 'DELETE',
        headers: active ? { 'Content-Type': 'application/json' } : undefined,
        body: active ? JSON.stringify({ movieId: movie.id, slug: movie.slug, title: movie.title, posterUrl: movie.posterUrl }) : undefined,
    }).catch(() => undefined);
};
const syncHistory = (item: WatchHistory) => {
    if (typeof window === 'undefined') return;
    void fetch('/api/history', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }).catch(() => undefined);
};
interface LibraryState {
    favorites: FavoriteMovie[];
    history: WatchHistory[];
    toggleFavorite: (m: Movie) => void;
    saveProgress: (m: Movie, progress: number, duration: number, season?: number, episode?: number) => void;
    removeHistory: (movieId: number) => void;
    clearHistory: () => void;
}

function migrateLibraryState(persistedState: unknown): LibraryState {
    const state = persistedState as Partial<LibraryState> | undefined;
    return {
        ...state,
        favorites: (state?.favorites ?? []).map((item) => ({
            ...item,
            posterUrl: normalizeLegacyNguoncPosterUrl(item.posterUrl),
        })),
        history: (state?.history ?? []).map((item) => ({
            ...item,
            posterUrl: normalizeLegacyNguoncPosterUrl(item.posterUrl),
        })),
    } as LibraryState;
}
export const useLibraryStore = create<LibraryState>()(
    persist(
        (set) => ({
            favorites: [],
            history: [],
            toggleFavorite: (m) => {
                const active = !useLibraryStore.getState().favorites.some((x) => x.movieId === m.id);
                syncFavorite(m, active);
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
                }));
            },
            saveProgress: (m, progress, duration, season, episode) => {
                const item = { movieId: m.id, slug: m.slug, title: m.title, posterUrl: m.posterUrl, progress, duration, updatedAt: new Date().toISOString(), season, episode };
                syncHistory(item);
                set((s) => ({
                    history: [
                        item,
                        ...s.history.filter((x) => x.movieId !== m.id),
                    ].slice(0, 50),
                }));
            },
            removeHistory: (movieId) => set((s) => ({ history: s.history.filter((item) => item.movieId !== movieId) })),
            clearHistory: () => set({ history: [] }),
        }),
        { name: 'cineva-library', version: 2, migrate: migrateLibraryState },
    ),
);
