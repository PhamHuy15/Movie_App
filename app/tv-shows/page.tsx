import { CatalogPage } from '@/components/movie/catalog-page';

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const { page } = await searchParams;
    const pageNum = Math.max(1, Number(page) || 1);

    return (
        <CatalogPage
            title="TV Shows"
            subtitle="Chương trình truyền hình, show thực tế và variety show"
            mode={{ type: 'category', slug: 'tv-shows' }}
            page={pageNum}
            hrefPrefix="/tv-shows?"
        />
    );
}
