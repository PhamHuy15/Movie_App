import { CatalogPage } from '@/components/movie/catalog-page';

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const { page } = await searchParams;
    const pageNum = Math.max(1, Number(page) || 1);

    return (
        <CatalogPage
            title="Phim lẻ"
            subtitle="Phim một tập và phim điện ảnh từ NguonC"
            mode={{ type: 'category', slug: 'phim-le' }}
            page={pageNum}
            hrefPrefix="/single-movies?"
        />
    );
}
