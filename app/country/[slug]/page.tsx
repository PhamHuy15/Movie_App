import { CatalogPage } from '@/components/movie/catalog-page';

const COUNTRY_MAP: Record<string, string> = {
    'au-my': 'Âu Mỹ',
    anh: 'Anh',
    'trung-quoc': 'Trung Quốc',
    indonesia: 'Indonesia',
    'viet-nam': 'Việt Nam',
    phap: 'Pháp',
    'hong-kong': 'Hồng Kông',
    'han-quoc': 'Hàn Quốc',
    'nhat-ban': 'Nhật Bản',
    'thai-lan': 'Thái Lan',
    'dai-loan': 'Đài Loan',
    nga: 'Nga',
    'ha-lan': 'Hà Lan',
    philippines: 'Philippines',
    'an-do': 'Ấn Độ',
};

export function generateStaticParams() {
    return Object.keys(COUNTRY_MAP).map((slug) => ({ slug }));
}

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}) {
    const { slug } = await params;
    const { page } = await searchParams;
    const pageNum = Math.max(1, Number(page) || 1);
    const name = COUNTRY_MAP[slug] ?? slug;

    return (
        <CatalogPage
            title={`Phim ${name}`}
            subtitle={`Tổng hợp phim ${name} từ NguonC`}
            mode={{ type: 'country', slug }}
            page={pageNum}
            hrefPrefix={`/country/${slug}?`}
        />
    );
}
