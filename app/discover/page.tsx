import { CatalogPage, type CatalogMode } from '@/components/movie/catalog-page';
import { FilterBar } from '@/components/movie/filter-bar';

const GENRE_LABELS: Record<string, string> = {
    'hanh-dong': 'Hành động',
    'tam-ly': 'Tâm lý',
    'tinh-cam': 'Tình cảm',
    'kinh-di': 'Kinh dị',
};

const COUNTRY_LABELS: Record<string, string> = {
    'han-quoc': 'Hàn Quốc',
    'trung-quoc': 'Trung Quốc',
    'nhat-ban': 'Nhật Bản',
    'thai-lan': 'Thái Lan',
    'au-my': 'Âu Mỹ',
    'viet-nam': 'Việt Nam',
};

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; genre?: string; country?: string }>;
}) {
    const { page, genre, country } = await searchParams;
    const pageNum = Math.max(1, Number(page) || 1);
    const mode: CatalogMode = genre
        ? { type: 'genre', slug: genre }
        : country
          ? { type: 'country', slug: country }
          : { type: 'new' };
    const title = genre
        ? `Thể loại ${GENRE_LABELS[genre] ?? genre}`
        : country
          ? `Phim ${COUNTRY_LABELS[country] ?? country}`
          : 'Khám phá';
    const filterQuery = genre
        ? `genre=${encodeURIComponent(genre)}&`
        : country
          ? `country=${encodeURIComponent(country)}&`
          : '';

    return (
        <>
            <div className="px-5 pt-24 lg:px-10">
                <FilterBar />
            </div>
            <CatalogPage
                title={title}
                subtitle="Duyệt phim trực tiếp từ kho NguonC"
                mode={mode}
                page={pageNum}
                hrefPrefix={`/discover?${filterQuery}`}
            />
        </>
    );
}
