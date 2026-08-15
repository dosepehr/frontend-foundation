import createBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

// Validates required environment variables before the dev/build/start
// server runs, instead of letting `undefined` reach the API at runtime.
// (Next's config loader transpiles this file to CJS and `require()`s it, so
// this must be a plain synchronous import — no top-level await.)
import './src/utils/env/env';

const withBundleAnalyzer = createBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
        ],
    },
    async redirects() {
        return [
            // Storybook's built HTML uses relative asset paths (./sb-manager/...),
            // so it must be served from a URL whose base is /stories/. Next strips
            // trailing slashes, so redirect to the index.html file directly.
            {
                source: '/stories',
                destination: '/stories/index.html',
                permanent: false,
            },
        ];
    },
    async headers() {
        return [
            {
                // Storybook renders each story inside a same-origin iframe.html,
                // so it needs SAMEORIGIN rather than the global DENY.
                source: '/stories/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                ],
            },
            {
                source: '/((?!stories/).*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        // Denies browser features this app doesn't use, on
                        // every frame (including third-party embeds, unlike
                        // frame-ancestors which only governs embedding us).
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=()',
                    },
                ],
            },
            {
                source: '/sw.js',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/javascript; charset=utf-8',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'no-cache, no-store, must-revalidate',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self'",
                    },
                ],
            },
        ];
    },
};

export default withSentryConfig(withBundleAnalyzer(nextConfig), {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    // Skips the source map upload (with a warning) instead of failing the
    // build when Sentry isn't configured yet.
    silent: true,
    widenClientFileUpload: true,
    webpack: {
        treeshake: {
            removeDebugLogging: true,
        },
    },
});
