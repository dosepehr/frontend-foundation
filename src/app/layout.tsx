import { estedad, lato } from '@/public/fonts';
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';
import { AppleSplashScreens } from '../components/Providers/AppleSplashScreens';
import { MockProvider } from '../components/Providers/MockProvider/MockProvider';
import { ServiceWorkerRegister } from '../components/Providers/ServiceWorkerRegister/ServiceWorkerRegister';
import { DirectionProvider } from '../components/ui/direction';
import { Toaster } from '../components/ui/Toast/components';
import { TooltipProvider } from '../components/ui/Tooltip/components';
import ReactQueryProvider from '../utils/api/provider/ReactQueryProvider';
import './globals.css';
import { PWAInstall } from '../components/ui/PWAInstall';

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            suppressHydrationWarning
            className={`overflow-x-hidden antialiased ${estedad.variable} ${lato.variable}`}
            lang='en'
        >
            <body>
                <AppleSplashScreens />
                <ServiceWorkerRegister />
                <PWAInstall />
                <NextTopLoader color="#155dfc" showSpinner={false} />
                <MockProvider>
                    <ReactQueryProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                        >
                            <DirectionProvider dir="ltr">
                                <Toaster />
                                <TooltipProvider>{children}</TooltipProvider>
                            </DirectionProvider>
                        </ThemeProvider>
                    </ReactQueryProvider>
                </MockProvider>
            </body>
        </html>
    );
}
