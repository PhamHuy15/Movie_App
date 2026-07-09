import type { MovieDetail } from '@/types/movie';

export const fixtureMovie: MovieDetail = {
    id: 101,
    slug: 'phim-qa',
    title: 'Đi Qua Mùa Hạ',
    originalTitle: 'Summer Passage',
    overview: 'Dữ liệu kiểm thử tiếng Việt.',
    posterUrl: '/placeholder.svg',
    backdropUrl: '/placeholder.svg',
    year: 2026,
    rating: 8.6,
    genres: [{ id: 1, name: 'Tâm lý' }],
    country: { code: 'VN', name: 'Việt Nam' },
    type: 'series',
    quality: 'HD',
    runtime: 120,
    status: 'Đã phát hành',
    director: 'QA Cineva',
    credits: [],
    seasons: [
        {
            number: 1,
            title: 'Mùa 1',
            episodes: [
                { id: 's1e1', number: 1, title: 'Tập 1', duration: 120 },
                { id: 's1e2', number: 2, title: 'Tập 2', duration: 120 },
            ],
        },
    ],
};
