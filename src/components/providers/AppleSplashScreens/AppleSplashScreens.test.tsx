import { render } from '@testing-library/react';
import { AppleSplashScreens } from '.';

// React 19 hoists <link> elements into document.head.
describe('AppleSplashScreens', () => {
    it('emits one apple-touch-startup-image link per supported device', () => {
        render(<AppleSplashScreens />);
        const links = document.head.querySelectorAll(
            'link[rel="apple-touch-startup-image"]',
        );

        expect(links).toHaveLength(12);
    });

    it('matches each image to its device size and pixel ratio', () => {
        render(<AppleSplashScreens />);
        const link = document.head.querySelector(
            'link[href="/pwa/splash/splash-1290x2796.png"]',
        );

        expect(link).toHaveAttribute(
            'media',
            '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        );
    });
});
