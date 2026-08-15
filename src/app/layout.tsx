import { estedad, lato } from '@/public/fonts';
import { MotionConfig } from 'motion/react';
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';
import { headers } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import { AppleSplashScreens } from '../components/Providers/AppleSplashScreens';
import { MockProvider } from '../components/Providers/MockProvider/MockProvider';
import { ServiceWorkerRegister } from '../components/Providers/ServiceWorkerRegister/ServiceWorkerRegister';
import { DirectionProvider } from '../components/ui/direction';
import { PWAInstall } from '../components/ui/PWAInstall';
import Toaster from '../components/ui/Toast';
import { TooltipProvider } from '../components/ui/Tooltip/components';
import ReactQueryProvider from '../utils/api/provider/ReactQueryProvider';
import './globals.css';

export const metadata: Metadata = {
    applicationName: 'Frontend Foundation',
    title: {
        default: 'Frontend Foundation',
        template: '%s | Frontend Foundation',
    },
    description:
        'Frontend Foundation — a React, TypeScript and Tailwind component library.',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Foundation',
    },
    formatDetection: {
        telephone: false,
    },
    icons: {
        icon: [
            { url: '/pwa/icon.svg', type: 'image/svg+xml' },
            { url: '/favicon.ico', sizes: 'any' },
        ],
        apple: '/pwa/apple-touch-icon.png',
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    ],
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Set by `src/proxy.ts` on every request; threaded through so
    // next-themes' no-flash script satisfies the nonce-scoped CSP.
    const nonce = (await headers()).get('x-nonce') ?? undefined;

    return (
        <html
            suppressHydrationWarning
            className={`overflow-x-hidden antialiased ${estedad.variable} ${lato.variable}`}
            lang="en"
        >
            <body>
                <AppleSplashScreens />
                <ServiceWorkerRegister />
                <PWAInstall />
                <NextTopLoader color="#155dfc" showSpinner={false} />
                <MotionConfig reducedMotion="user">
                    <MockProvider>
                        <ReactQueryProvider>
                            <ThemeProvider
                                attribute="class"
                                defaultTheme="system"
                                enableSystem
                                nonce={nonce}
                            >
                                <DirectionProvider dir="ltr">
                                    <Toaster />
                                    <TooltipProvider>
                                        {children}
                                    </TooltipProvider>
                                </DirectionProvider>
                            </ThemeProvider>
                        </ReactQueryProvider>
                    </MockProvider>
                </MotionConfig>
            </body>
        </html>
    );
}
