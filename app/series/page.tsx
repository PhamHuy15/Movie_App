import { CatalogPage } from '@/components/movie/catalog-page';

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const { page } = await searchParams;
    const pageNum = Math.max(1, Number(page) || 1);

    return (
        <CatalogPage
            title="Phim bộ"
            subtitle="Phim nhiều tập từ kho NguonC"
            mode={{ type: 'category', slug: 'phim-bo' }}
            page={pageNum}
            hrefPrefix="/series?"
        />
    );
}
