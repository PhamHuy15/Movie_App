import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fixtureMovie } from '@/tests/fixtures/movies';

const loadSource = vi.fn();
const attachMedia = vi.fn();
const destroy = vi.fn();
vi.mock('hls.js', () => ({
    default: class MockHls {
        static isSupported() {
            return true;
        }
        static Events = { ERROR: 'error' };
        static ErrorTypes = { NETWORK_ERROR: 'networkError', MEDIA_ERROR: 'mediaError' };
        loadSource = loadSource;
        attachMedia = attachMedia;
        destroy = destroy;
        on() {}
    },
}));

describe('VideoPlayer HLS', () => {
    beforeEach(() => {
        loadSource.mockClear();
        attachMedia.mockClear();
        destroy.mockClear();
    });
    it('nạp manifest HLS và hủy instance khi unmount', async () => {
        const { VideoPlayer } = await import('@/components/player/video-player');
        const { unmount } = render(
            <VideoPlayer
                movie={fixtureMovie}
                source={{
                    id: 'hls',
                    serverName: 'Fixture HLS',
                    type: 'hls',
                    url: 'https://stream.test/mock.m3u8',
                }}
            />,
        );
        expect(screen.getByLabelText(`Trình phát ${fixtureMovie.title}`)).toBeInTheDocument();
        expect(loadSource).toHaveBeenCalledWith('https://stream.test/mock.m3u8');
        expect(attachMedia).toHaveBeenCalled();
        unmount();
        expect(destroy).toHaveBeenCalled();
    });
});
