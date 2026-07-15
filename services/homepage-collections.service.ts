import type { Movie } from '@/types/movie';
import { uniqueMovies } from '@/lib/utils';
import { movieCatalogService } from '@/services/movie-catalog.service';

const COLLECTION_SIZE = 10;

export interface HomeCollection {
    id: string;
    title: string;
    href: string;
    movies: Movie[];
}

function fold(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function hasGenre(movie: Movie, keywords: string[]): boolean {
    const genres = fold(movie.genres.map((genre) => genre.name).join(' '));
    return keywords.some((keyword) => genres.includes(fold(keyword)));
}

export function fillCollection(primary: Movie[], fallback: Movie[], limit = COLLECTION_SIZE): Movie[] {
    return uniqueMovies([...primary, ...fallback]).slice(0, Math.max(7, limit));
}

function collection(id: string, title: string, href: string, primary: Movie[], fallback: Movie[]): HomeCollection {
    return { id, title, href, movies: fillCollection(primary, fallback) };
}

export const homepageCollectionsService = {
    async getCollections(recommendations: Movie[], fallbackPool: Movie[]): Promise<HomeCollection[]> {
        const [airing, adventure, china, romance, costume, korea, youth, healing, literature, office, crime, western] =
            await Promise.all([
                movieCatalogService.listByCategory('dang-chieu', 1),
                movieCatalogService.listByGenre('phieu-luu', 1),
                movieCatalogService.listByCountry('trung-quoc', 1),
                movieCatalogService.listByGenre('tinh-cam', 1),
                movieCatalogService.listByGenre('co-trang', 1),
                movieCatalogService.listByCountry('han-quoc', 1),
                movieCatalogService.listBySearch('thanh xuân', 1),
                movieCatalogService.listBySearch('chữa lành', 1),
                movieCatalogService.listBySearch('văn học', 1),
                movieCatalogService.listBySearch('công sở', 1),
                movieCatalogService.listBySearch('hình sự', 1),
                movieCatalogService.listByCountry('au-my', 1),
            ]);

        const highQuality = fallbackPool.filter((movie) => {
            const language = fold(movie.language ?? '');
            const quality = fold(movie.quality ?? '');
            return /hd|full hd|fhd|4k|uhd/.test(quality) && (language.includes('+') || language.includes('vietsub'));
        });
        const fourK = fallbackPool.filter((movie) => /4k|uhd/i.test(movie.quality ?? ''));
        const mainlandSeries = china.movies.filter((movie) => movie.type === 'series');
        const koreanCrime = korea.movies.filter((movie) => hasGenre(movie, ['hình sự', 'tội phạm', 'trinh thám']));
        const ancientFantasy = costume.movies.filter((movie) => hasGenre(movie, ['cổ trang', 'viễn tưởng', 'phiêu lưu', 'chính kịch']));

        return [
            collection('for-you', 'Đề Xuất Cho Bạn', '/discover', recommendations, fallbackPool),
            collection('airing', 'Đang Chiếu Phát', '/discover?category=dang-chieu', airing.movies, fallbackPool),
            collection('bilingual-hd', 'Phim Chất Lượng Cao và Phụ Đề Song Ngữ', '/discover', highQuality, fallbackPool),
            collection('adventure', 'Phiêu Lưu Mạo Hiểm', '/discover?genre=phieu-luu', adventure.movies, fallbackPool),
            collection('mainland-tv', 'Phim Truyền Hình Trung Quốc Đại Lục', '/discover?country=trung-quoc', mainlandSeries, china.movies),
            collection('love', 'Tình Yêu Là Những Gì Trái Tim Muốn', '/discover?genre=tinh-cam', romance.movies, fallbackPool),
            collection('costume-fantasy', 'Cổ Trang Huyền Ảo', '/discover?genre=co-trang', costume.movies, china.movies),
            collection('korean', 'Phim Hàn Quốc', '/discover?country=han-quoc', korea.movies, fallbackPool),
            collection('youth', 'Thanh Xuân', '/search?q=thanh%20xuân', youth.movies, romance.movies),
            collection('healing', 'Phim “Chữa Lành Tâm Hồn”', '/search?q=chữa%20lành', healing.movies, romance.movies),
            collection('literature', 'Phim Chuyển Thể Từ Tác Phẩm Văn Học', '/search?q=văn%20học', literature.movies, romance.movies),
            collection('4k', 'Phim 4K', '/search?q=4K', fourK, highQuality),
            collection('office', 'Phim Công Sở', '/search?q=công%20sở', office.movies, romance.movies),
            collection('korean-crime', 'Hình Sự Tội Phạm Hàn Quốc', '/discover?country=han-quoc', koreanCrime, [...crime.movies, ...korea.movies]),
            collection('must-watch-fantasy', 'Phim Cổ Trang Huyền Huyễn Không Thể Bỏ Lỡ', '/discover?genre=co-trang', ancientFantasy, [...costume.movies].reverse()),
            collection('western', 'Điện Ảnh Âu Mỹ', '/discover?country=au-my', western.movies, fallbackPool),
        ];
    },
};

