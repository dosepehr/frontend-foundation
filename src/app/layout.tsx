import { estedad, lato } from '@/public/fonts';
import { ThemeProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';
import { MockProvider } from '../components/Providers/MockProvider/MockProvider';
import { DirectionProvider } from '../components/ui/direction';
import { Toaster } from '../components/ui/Toast/components';
import { TooltipProvider } from '../components/ui/Tooltip/components';
import ReactQueryProvider from '../utils/api/provider/ReactQueryProvider';
import './globals.css';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            suppressHydrationWarning
            className={`overflow-x-hidden antialiased ${estedad.variable} ${lato.variable}`}
        >
            <body>
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
