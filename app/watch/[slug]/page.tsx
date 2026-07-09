import { notFound } from 'next/navigation';
import { WatchExperience } from '@/components/player/watch-experience';
import { movieCatalogService } from '@/services/movie-catalog.service';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const movie = await movieCatalogService.detail((await params).slug);
    if (!movie) notFound();
    return <WatchExperience movie={movie} />;
}
