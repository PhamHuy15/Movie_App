import { describe, expect, it } from 'vitest';
import { normalizeNguoncFilm } from '@/services/nguonc-normalizer';

describe('normalizeNguoncFilm', () => {
    it('chuẩn hóa metadata phim từ NguonC', () => {
        const movie = normalizeNguoncFilm({
            name: 'Manga Sát Lệnh',
            slug: 'manga-sat-lenh',
            original_name: 'Mr.Kill',
            description: 'Mô tả phim',
            thumb_url: 'https://phim.nguonc.com/public/images/Post/8/manga-sat-lenh.jpg',
            poster_url: 'https://phim.nguonc.com/public/images/Post/8/manga-sat-lenh-1.jpg',
            quality: 'HD',
            episode_current: 'Tập 1',
            episode_total: '10',
        });
        expect(movie).toMatchObject({
            slug: 'manga-sat-lenh',
            title: 'Manga Sát Lệnh',
            originalTitle: 'Mr.Kill',
            type: 'series',
            quality: 'HD',
        });
        expect(movie.posterUrl).toContain('phim.nguonc.com');
    });

    it('xử lý phim lẻ (Full) đúng cách', () => {
        const movie = normalizeNguoncFilm({
            name: 'Phim Lẻ Test',
            slug: 'phim-le-test',
            thumb_url: 'https://phim.nguonc.com/img.jpg',
            episode_current: 'Full',
            episode_total: '1',
        });
        expect(movie.type).toBe('movie');
        expect(movie.latestEpisode).toBeUndefined();
    });

    it('slug tạo ID ổn định', () => {
        const m1 = normalizeNguoncFilm({ name: 'A', slug: 'test-slug', thumb_url: '' });
        const m2 = normalizeNguoncFilm({ name: 'B', slug: 'test-slug', thumb_url: '' });
        expect(m1.id).toBe(m2.id);
    });
});
