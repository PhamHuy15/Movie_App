import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { movieCatalogService } from '@/services/movie-catalog.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes = ['', '/movies', '/series', '/single-movies', '/discover', '/showtimes', '/phim-bo', '/phim-le', '/phim-han', '/phim-trung', '/phim-au-my', '/kham-pha', '/lich-chieu', '/xem-chung', '/thu-vien', '/lich-su'].map((path) => ({
        url: `${siteConfig.url}${path}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
    }));

    const result = await movieCatalogService.listNew(1);
    const movieRoutes = result.movies.map((movie) => ({
        url: `${siteConfig.url}/movie/${movie.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
    }));

    return [...staticRoutes, ...movieRoutes];
}
