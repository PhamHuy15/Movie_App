export interface Genre {
    id: number;
    name: string;
}
export interface Country {
    code: string;
    name: string;
}
export interface Movie {
    id: number;
    slug: string;
    title: string;
    originalTitle: string;
    overview: string;
    posterUrl: string;
    backdropUrl: string;
    year: number;
    rating: number;
    genres: Genre[];
    country: Country;
    type: 'movie' | 'series';
    quality?: string;
    latestEpisode?: string;
    featured?: boolean;
}
export interface MovieCredit {
    id: number;
    name: string;
    character: string;
    profileUrl?: string;
}
export interface Episode {
    id: string;
    number: number;
    title: string;
    duration: number;
}
export interface Season {
    number: number;
    title: string;
    episodes: Episode[];
}
export interface MovieDetail extends Movie {
    runtime: number;
    status: string;
    director: string;
    credits: MovieCredit[];
    seasons: Season[];
    trailerKey?: string;
}
export interface SubtitleTrack {
    label: string;
    language: string;
    url: string;
    default?: boolean;
}
export type Subtitle = SubtitleTrack;
export interface StreamSource {
    id: string;
    serverName: string;
    type: 'hls' | 'mp4' | 'embed';
    url: string;
    quality?: string;
    subtitles?: SubtitleTrack[];
}
export interface StreamProvider {
    getMovieSources(movieId: string): Promise<StreamSource[]>;
    getEpisodeSources(movieId: string, season: number, episode: number): Promise<StreamSource[]>;
}
export interface WatchHistory {
    movieId: number;
    slug: string;
    title: string;
    posterUrl: string;
    progress: number;
    duration: number;
    updatedAt: string;
}
export interface FavoriteMovie {
    movieId: number;
    slug: string;
    title: string;
    posterUrl: string;
    addedAt: string;
}
