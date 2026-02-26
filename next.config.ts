import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'github.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'avatar.vercel.sh',
                port: '',
            },
        ],
    },
};

export default nextConfig;

