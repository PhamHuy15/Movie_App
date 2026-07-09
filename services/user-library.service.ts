import type { FavoriteMovie, WatchHistory } from '@/types/movie';
export const userLibraryService = {
    async sync(_favorites: FavoriteMovie[], _history: WatchHistory[]) {
        void _favorites;
        void _history;
        return { synced: false, reason: 'guest-mode' as const };
    },
};
