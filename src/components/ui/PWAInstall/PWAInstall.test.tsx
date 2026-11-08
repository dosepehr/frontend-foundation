import { act, fireEvent, render, screen } from '@testing-library/react';
import { PWAInstall } from '.';
import type { BeforeInstallPromptEvent } from './PWAInstall.types';

const COOKIE = 'pwa_install_dismissed';

const clearDismissCookie = () => {
    document.cookie = `${COOKIE}=; path=/; max-age=0`;
};

const firePrompt = (outcome: 'accepted' | 'dismissed') => {
    const prompt = vi.fn(async () => {});
    const event = Object.assign(new Event('beforeinstallprompt'), {
        platforms: ['web'],
        userChoice: Promise.resolve({ outcome, platform: 'web' }),
        prompt,
    }) as BeforeInstallPromptEvent;
    act(() => {
        window.dispatchEvent(event);
    });
    return prompt;
};

const mockStandalone = (matches: boolean) =>
    vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);

describe('PWAInstall', () => {
    beforeEach(() => {
        clearDismissCookie();
        mockStandalone(false);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        clearDismissCookie();
    });

    it('renders nothing until the browser offers an install prompt', () => {
        const { container } = render(<PWAInstall />);
        expect(container).toBeEmptyDOMElement();
    });

    it('shows the prompt and triggers the native install on Install', async () => {
        render(<PWAInstall />);
        const prompt = firePrompt('accepted');

        expect(screen.getByText('Install app')).toBeInTheDocument();
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /install/i }));
        });

        expect(prompt).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('Install app')).not.toBeInTheDocument();
        expect(document.cookie).not.toContain(COOKIE);
    });

    it('remembers a dismissal from the native install dialog', async () => {
        render(<PWAInstall />);
        firePrompt('dismissed');

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /install/i }));
        });

        expect(document.cookie).toContain(COOKIE);
    });

    it('hides and remembers the choice when the user picks Later', () => {
        render(<PWAInstall />);
        firePrompt('accepted');

        fireEvent.click(screen.getByRole('button', { name: 'Later' }));

        expect(screen.queryByText('Install app')).not.toBeInTheDocument();
        expect(document.cookie).toContain(COOKIE);
    });

    it('shows manual Add to Home Screen steps on iOS', () => {
        vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
        );
        render(<PWAInstall />);

        expect(
            screen.getByText('To install, follow these steps:'),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Got it' }),
        ).toBeInTheDocument();
    });

    it('stays hidden when already running as an installed app', () => {
        mockStandalone(true);
        const { container } = render(<PWAInstall />);
        firePrompt('accepted');

        expect(container).toBeEmptyDOMElement();
    });

    it('stays hidden while a recent dismissal is remembered', () => {
        document.cookie = `${COOKIE}=${Date.now()}; path=/`;
        const { container } = render(<PWAInstall />);
        firePrompt('accepted');

        expect(container).toBeEmptyDOMElement();
    });
});
