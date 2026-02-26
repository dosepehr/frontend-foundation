import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/utils/context/ThemeProvider';
import { estedad, lato } from 'public/fonts';
import { TooltipProvider } from '@/components/ui/Tooltip/components';
import { Toaster } from '@/components/ui/Toast';

export const metadata: Metadata = {
    title: 'Frontend foundation',
    description: 'Frontend foundation',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang='en'
            className={`antialiased overflow-x-hidden ${estedad.variable} ${lato.variable}`}
        >
            <body>
                <TooltipProvider>
                    <ThemeProvider defaultTheme='system' storageKey='ui-theme'>
                        {children}
                    </ThemeProvider>
                    <Toaster richColors />
                </TooltipProvider>
            </body>
        </html>
    );
}

