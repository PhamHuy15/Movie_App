import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VideoPlayer } from '@/components/player/video-player';
import { fixtureMovie } from '@/tests/fixtures/movies';

describe('VideoPlayer', () => {
    it('nhận MP4 source, phụ đề và không autoplay âm thanh', () => {
        render(
            <VideoPlayer
                movie={fixtureMovie}
                source={{
                    id: 'mp4',
                    serverName: 'QA',
                    type: 'mp4',
                    url: 'https://stream.test/video.mp4',
                    subtitles: [
                        { label: 'Tiếng Việt', language: 'vi', url: 'https://stream.test/subtitle.vtt', default: true },
                    ],
                }}
            />,
        );
        const video = screen.getByLabelText(`Trình phát ${fixtureMovie.title}`);
        expect((video as HTMLVideoElement).muted).toBe(true);
        expect(video).not.toHaveAttribute('autoplay');
        expect(video.querySelector('track')).toHaveAttribute('srclang', 'vi');
    });
});
