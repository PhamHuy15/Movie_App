import { http, HttpResponse } from 'msw';

export const mockNguoncList = {
    status: 'success',
    items: [
        {
            name: 'Manga Sát Lệnh',
            slug: 'manga-sat-lenh',
            original_name: 'Mr.Kill',
            thumb_url: 'https://phim.nguonc.com/public/images/Post/8/manga-sat-lenh.jpg',
            poster_url: 'https://phim.nguonc.com/public/images/Post/8/manga-sat-lenh-1.jpg',
            quality: 'HD',
            episode_current: 'Tập 1',
            episode_total: '10',
            year: 2026,
        },
        {
            name: 'Phim Lẻ Cũ',
            slug: 'phim-le-cu',
            thumb_url: 'https://phim.nguonc.com/img.jpg',
            episode_current: 'Full',
            episode_total: '1',
            year: 2025,
        },
    ],
    paginate: {
        current_page: 1,
        total_page: 2,
        total_items: 20,
        items_per_page: 10,
    },
};

export const mockNguoncDetail = {
    status: 'success',
    movie: {
        id: '4031da8c46633e955c265b95ba0d9b24',
        name: 'Manga Sát Lệnh',
        slug: 'manga-sat-lenh',
        original_name: 'Mr.Kill',
        thumb_url: 'https://phim.nguonc.com/public/images/Post/8/manga-sat-lenh.jpg',
        poster_url: 'https://phim.nguonc.com/public/images/Post/8/manga-sat-lenh-1.jpg',
        description: 'Mô tả phim',
        total_episodes: 10,
        current_episode: 'Tập 1',
        time: '43 Phút/Tập',
        quality: 'HD',
        language: 'Vietsub',
        director: 'Chic Sakon',
        casts: 'Dew Jirawat',
        category: {
            '1': {
                group: { id: '1', name: 'Định dạng' },
                list: [{ id: '1', name: 'Phim bộ' }],
            },
            '2': {
                group: { id: '2', name: 'Thể loại' },
                list: [{ id: '2', name: 'Chính Kịch' }],
            },
        },
        episodes: [
            {
                server_name: 'Vietsub #1',
                items: [
                    { name: '1', slug: 'tap-1', embed: 'https://embed.stream/1' },
                    { name: '2', slug: 'tap-2', embed: 'https://embed.stream/2' },
                ],
            },
        ],
    },
};

export const mockNguoncDetailPhim1 = {
    status: 'success',
    movie: {
        id: 'phim-1',
        name: 'Phim Bộ Phim 1',
        slug: 'phim-1',
        original_name: 'Phim 1 Original',
        thumb_url: 'https://phim.nguonc.com/img.jpg',
        total_episodes: 10,
        current_episode: 'Tập 1',
        quality: 'HD',
        episodes: [
            {
                server_name: 'Vietsub #1',
                items: [
                    { name: '1', slug: 'tap-1', embed: 'https://embed.stream/1', m3u8: 'https://embed.stream/1.m3u8' },
                    { name: '2', slug: 'tap-2', embed: 'https://embed.stream/2', m3u8: 'https://embed.stream/2.m3u8' },
                ],
            },
        ],
    },
};

export const handlers = [
    // Intercept NguonC list endpoints
    http.get('https://phim.nguonc.com/api/films/phim-moi-cap-nhat', () => {
        return HttpResponse.json(mockNguoncList);
    }),
    http.get('https://phim.nguonc.com/api/films/danh-sach/:slug', () => {
        return HttpResponse.json(mockNguoncList);
    }),
    http.get('https://phim.nguonc.com/api/films/search', () => {
        return HttpResponse.json(mockNguoncList);
    }),

    // Intercept NguonC detail endpoints
    http.get('https://phim.nguonc.com/api/film/manga-sat-lenh', () => {
        return HttpResponse.json(mockNguoncDetail);
    }),
    http.get('https://phim.nguonc.com/api/film/phim-1', () => {
        return HttpResponse.json(mockNguoncDetailPhim1);
    }),
    http.get('https://phim.nguonc.com/api/film/:slug', ({ params }) => {
        if (params.slug === 'unknown' || params.slug === 'missing') {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(mockNguoncDetail);
    }),
];
