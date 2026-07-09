import { CatalogPage } from '@/components/movie/catalog-page';

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const { page } = await searchParams;
    const pageNum = Math.max(1, Number(page) || 1);

    return (
        <CatalogPage
            title="Hoạt hình"
            subtitle="Anime và phim hoạt hình từ NguonC"
            mode={{ type: 'category', slug: 'hoat-hinh' }}
            page={pageNum}
            hrefPrefix="/animation?"
        />
    );
}
