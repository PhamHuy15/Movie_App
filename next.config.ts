import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'phim.nguonc.com' },
            { protocol: 'https', hostname: '*.nguonc.com' },
            { protocol: 'https', hostname: 'cdn.nguonc.com' },
            { protocol: 'https', hostname: 'img.nguonc.com' },
            { protocol: 'https', hostname: '**' },
        ],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                ],
            },
        ];
    },
};
export default nextConfig;
