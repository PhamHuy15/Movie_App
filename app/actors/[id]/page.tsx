import { MovieSection } from '@/components/home/movie-section';
import { movieCatalogService } from '@/services/movie-catalog.service';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await movieCatalogService.listNew(1);

    return (
        <div className="pt-24">
            <div className="px-5 lg:px-10">
                <p className="text-brand">Hồ sơ diễn viên #{id}</p>
                <h1 className="mt-2 text-4xl font-black">Đang cập nhật</h1>
                <p className="mt-5 max-w-2xl leading-7 text-white/55">
                    NguonC chưa cung cấp endpoint hồ sơ diễn viên riêng. Danh sách bên dưới là phim mới cập nhật từ
                    NguonC.
                </p>
            </div>
            <MovieSection title="Phim mới từ NguonC" movies={result.movies.slice(0, 6)} />
        </div>
    );
}
