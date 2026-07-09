'use client';

import Hls from 'hls.js';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLibraryStore } from '@/store/library-store';
import type { Movie, StreamSource } from '@/types/movie';

interface VideoPlayerProps {
    movie: Movie;
    source: StreamSource;
    onEnded?: () => void;
    onSourceError?: () => boolean;
}

export function VideoPlayer({ movie, source, onEnded, onSourceError }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState('');
    const [retryKey, setRetryKey] = useState(0);
    const saveProgress = useLibraryStore((state) => state.saveProgress);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || source.type === 'embed') return;

        setError('');
        let hls: Hls | undefined;
        const progressKey = `cineva-progress-${movie.id}`;

        if (source.type === 'hls') {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source.url;
            } else if (Hls.isSupported()) {
                hls = new Hls({ enableWorker: true, lowLatencyMode: false });
                hls.loadSource(source.url);
                hls.attachMedia(video);
                hls.on(Hls.Events.ERROR, (_event, data) => {
                    if (!data.fatal) return;
                    if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls?.startLoad();
                    else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls?.recoverMediaError();
                    else {
                        if (!onSourceError?.()) setError('Nguồn HLS không thể phát trên thiết bị này.');
                        hls?.destroy();
                    }
                });
            } else {
                queueMicrotask(() => setError('Trình duyệt không hỗ trợ HLS.'));
            }
        } else {
            video.src = source.url;
        }

        const restore = () => {
            const saved = Number(localStorage.getItem(progressKey) ?? 0);
            if (Number.isFinite(saved) && saved < video.duration - 10) video.currentTime = saved;
        };
        const save = () => {
            localStorage.setItem(progressKey, String(video.currentTime));
            saveProgress(movie, video.currentTime, video.duration || 0);
        };
        const handleKeys = (event: KeyboardEvent) => {
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement).tagName)) return;
            if (event.code === 'Space') {
                event.preventDefault();
                if (video.paused) void video.play();
                else video.pause();
            }
            if (event.key.toLowerCase() === 'm') video.muted = !video.muted;
            if (event.key.toLowerCase() === 'f') void video.requestFullscreen();
            if (event.key === 'ArrowRight') video.currentTime = Math.min(video.duration, video.currentTime + 10);
            if (event.key === 'ArrowLeft') video.currentTime = Math.max(0, video.currentTime - 10);
        };

        video.addEventListener('loadedmetadata', restore);
        video.addEventListener('timeupdate', save);
        window.addEventListener('keydown', handleKeys);

        return () => {
            hls?.destroy();
            video.removeEventListener('loadedmetadata', restore);
            video.removeEventListener('timeupdate', save);
            window.removeEventListener('keydown', handleKeys);
        };
    }, [source, movie, saveProgress, retryKey, onSourceError]);

    if (source.type === 'embed') {
        return (
            <div className="aspect-video w-full bg-black">
                <iframe
                    src={source.url}
                    className="h-full w-full"
                    allowFullScreen
                    allow="autoplay; encrypted-media; picture-in-picture"
                    title={`Trình phát ${movie.title}`}
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="grid aspect-video place-items-center bg-black px-6 text-center text-white/65">
                <div>
                    <AlertTriangle className="mx-auto mb-3 text-amber-400" />
                    <p>{error}</p>
                    <button
                        onClick={() => setRetryKey((value) => value + 1)}
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 font-medium hover:bg-white/15"
                    >
                        <RefreshCw size={16} />
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <video
            ref={videoRef}
            controls
            playsInline
            muted
            preload="metadata"
            onEnded={onEnded}
            onError={() => {
                if (!onSourceError?.()) setError('Không thể tải nguồn phát. Vui lòng thử server khác.');
            }}
            className="aspect-video w-full bg-black"
            aria-label={`Trình phát ${movie.title}`}
        >
            {source.subtitles?.map((track) => (
                <track
                    key={`${track.language}-${track.url}`}
                    kind="subtitles"
                    src={track.url}
                    srcLang={track.language}
                    label={track.label}
                    default={track.default}
                />
            ))}
        </video>
    );
}
