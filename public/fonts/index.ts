import { Lato } from 'next/font/google';

import localFont from 'next/font/local';
export const lato = Lato({
    display: 'swap',
    subsets: ['latin'],
    weight: ['300', '400', '700', '900'],
    variable: '--font-lato',
});

export const estedad = localFont({
    src: [
        {
            path: './estedad/Estedad-Thin.ttf',
            weight: '100',
            style: 'normal',
        },
        {
            path: './estedad/Estedad-Light.ttf',
            weight: '300',
            style: 'normal',
        },
        {
            path: './estedad/Estedad-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: './estedad/Estedad-SemiBold.ttf',
            weight: '600',
            style: 'normal',
        },
        {
            path: './estedad/Estedad-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: './estedad/Estedad-Black.ttf',
            weight: '900',
            style: 'normal',
        },
    ],
    variable: '--font-estedad',
});

