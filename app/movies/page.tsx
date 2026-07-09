import { CatalogPage } from '@/components/movie/catalog-page';

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const { page } = await searchParams;
    const pageNum = Math.max(1, Number(page) || 1);

    return (
        <CatalogPage
            title="Phim mới cập nhật"
            subtitle="Danh sách phim mới nhất từ NguonC"
            mode={{ type: 'new' }}
            page={pageNum}
            hrefPrefix="/movies?"
        />
    );
}
