import { TooltipProvider } from '../components/ui/Tooltip';
import './globals.css';
import { estedad, lato } from '@/public/fonts';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            suppressHydrationWarning
            className={`antialiased overflow-x-hidden ${estedad.variable} ${lato.variable}`}
        >
            <body>
                <TooltipProvider>{children}</TooltipProvider>
            </body>
        </html>
    );
}

