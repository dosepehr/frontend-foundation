import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        id: '/',
        name: 'Frontend Foundation',
        short_name: 'Foundation',
        description:
            'Frontend Foundation — a React, TypeScript and Tailwind component library.',
        lang: 'en',
        dir: 'ltr',
        categories: ['developer', 'productivity'],
        start_url: '/?source=pwa',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#155dfc',
        shortcuts: [
            {
                name: 'Home',
                short_name: 'Home',
                url: '/',
                icons: [
                    {
                        src: '/pwa/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                ],
            },
        ],
        screenshots: [
            {
                src: '/pwa/screenshot-wide.png',
                sizes: '1280x720',
                type: 'image/png',
                form_factor: 'wide',
            },
            {
                src: '/pwa/screenshot-narrow.png',
                sizes: '720x1280',
                type: 'image/png',
                form_factor: 'narrow',
            },
        ],
        icons: [
            {
                src: '/pwa/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/pwa/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/pwa/icon-192-maskable.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/pwa/icon-512-maskable.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    };
}
