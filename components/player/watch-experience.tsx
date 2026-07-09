'use client';

import { RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { VideoPlayer } from '@/components/player/video-player';
import type { MovieDetail, StreamSource } from '@/types/movie';

export function WatchExperience({ movie }: { movie: MovieDetail }) {
    const episodes = movie.seasons[0]?.episodes ?? [];
    const [episode, setEpisode] = useState(episodes[0]?.number ?? 1);
    const [sources, setSources] = useState<StreamSource[]>([]);
    const [activeSource, setActiveSource] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const hasEpisodes = episodes.length > 0;

    const loadSources = useCallback(async () => {
        setLoading(true);
        setError('');

        const endpoint = hasEpisodes ? `/api/stream/${movie.slug}/1/${episode}` : `/api/stream/${movie.slug}`;

        try {
            const response = await fetch(endpoint);
            const payload = await response.json();
            if (!response.ok) throw new Error(payload.error);

            setSources(payload.sources ?? []);
            setActiveSource(0);
        } catch {
            setSources([]);
            setError('Không thể kết nối dịch vụ nguồn phát NguonC.');
        } finally {
            setLoading(false);
        }
    }, [episode, hasEpisodes, movie.slug]);

    useEffect(() => {
        const timeout = window.setTimeout(() => void loadSources(), 0);
        return () => window.clearTimeout(timeout);
    }, [loadSources]);

    const playNext = () => {
        const currentIndex = episodes.findIndex((item) => item.number === episode);
        const next = episodes[currentIndex + 1];
        if (next) setEpisode(next.number);
    };

    const tryNextServer = useCallback(() => {
        if (activeSource + 1 >= sources.length) return false;
        setActiveSource((value) => value + 1);
        return true;
    }, [activeSource, sources.length]);

    return (
        <div className="px-0 pt-16 pb-16 lg:px-10 lg:pt-24">
            <div className="mx-auto max-w-6xl overflow-hidden bg-black lg:rounded-2xl">
                {loading ? (
                    <div className="aspect-video animate-pulse bg-white/5" />
                ) : sources[activeSource] ? (
                    <VideoPlayer
                        key={`${episode}-${sources[activeSource].id}`}
                        movie={movie}
                        source={sources[activeSource]}
                        onEnded={playNext}
                        onSourceError={tryNextServer}
                    />
                ) : (
                    <div className="grid aspect-video place-items-center px-6 text-center text-white/55">
                        <div>
                            <p className="font-display text-2xl font-semibold text-white">Chưa có nguồn phát</p>
                            <p className="mt-2 text-sm">
                                {error || 'NguonC chưa trả về tập phim hoặc link phát cho nội dung này.'}
                            </p>
                            <button
                                onClick={() => void loadSources()}
                                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 font-medium"
                            >
                                <RefreshCw size={16} />
                                Thử lại
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mx-auto max-w-6xl px-5 py-7 lg:px-0">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-brand text-sm font-medium">
                            Đang xem{hasEpisodes ? ` · Tập ${episode}` : ''}
                        </p>
                        <h1 className="font-display mt-1 text-2xl leading-tight font-bold">{movie.title}</h1>
                    </div>

                    {sources.length > 0 && (
                        <label className="text-sm font-medium text-white/60">
                            Server
                            <select
                                value={activeSource}
                                onChange={(event) => setActiveSource(Number(event.target.value))}
                                className="ml-2 rounded-full bg-white/10 px-4 py-2 text-white"
                            >
                                {sources.map((source, index) => (
                                    <option key={source.id} value={index}>
                                        {source.serverName}
                                        {source.quality ? ` · ${source.quality}` : ''}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}
                </div>

                {hasEpisodes && (
                    <>
                        <h2 className="font-display mt-8 text-xl font-bold">Danh sách tập</h2>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {episodes.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setEpisode(item.number)}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium ${
                                        episode === item.number ? 'bg-brand text-black' : 'bg-white/8 hover:bg-white/12'
                                    }`}
                                >
                                    {item.title}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {movie.overview && <p className="mt-8 leading-7 text-white/60">{movie.overview}</p>}
            </div>
        </div>
    );
}
