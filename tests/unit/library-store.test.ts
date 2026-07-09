import { beforeEach, describe, expect, it } from 'vitest';
import { useLibraryStore } from '@/store/library-store';
import { fixtureMovie } from '@/tests/fixtures/movies';

describe('library store', () => {
    beforeEach(() => useLibraryStore.setState({ favorites: [], history: [] }));
    it('thêm và xóa phim yêu thích', () => {
        useLibraryStore.getState().toggleFavorite(fixtureMovie);
        expect(useLibraryStore.getState().favorites).toHaveLength(1);
        useLibraryStore.getState().toggleFavorite(fixtureMovie);
        expect(useLibraryStore.getState().favorites).toHaveLength(0);
    });
    it('lưu và cập nhật tiến độ xem', () => {
        useLibraryStore.getState().saveProgress(fixtureMovie, 30, 120);
        useLibraryStore.getState().saveProgress(fixtureMovie, 60, 120);
        expect(useLibraryStore.getState().history).toHaveLength(1);
        expect(useLibraryStore.getState().history[0]).toMatchObject({ progress: 60, duration: 120 });
    });
});
