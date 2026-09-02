import { act, cleanup, render, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { ServiceWorkerRegister } from './ServiceWorkerRegister';

vi.mock('sonner', () => ({
    toast: vi.fn(),
}));

function createFakeWorker() {
    return Object.assign(new EventTarget(), {
        state: 'installing',
        postMessage: vi.fn(),
    });
}

function createFakeRegistration(waiting: unknown = null) {
    return Object.assign(new EventTarget(), {
        waiting,
        installing: null as ReturnType<typeof createFakeWorker> | null,
        update: vi.fn(),
    });
}

function createFakeServiceWorkerContainer(
    registerImpl: () => Promise<ReturnType<typeof createFakeRegistration>>,
) {
    return Object.assign(new EventTarget(), {
        controller: null as unknown,
        register: vi.fn(registerImpl),
    });
}

function stubServiceWorker(
    sw: ReturnType<typeof createFakeServiceWorkerContainer> | undefined,
) {
    Object.defineProperty(navigator, 'serviceWorker', {
        value: sw,
        configurable: true,
    });
}

describe('ServiceWorkerRegister', () => {
    const originalReadyState = document.readyState;

    beforeEach(() => {
        Object.defineProperty(document, 'readyState', {
            value: 'complete',
            configurable: true,
        });
        Object.defineProperty(window, 'location', {
            value: { ...window.location, reload: vi.fn() },
            configurable: true,
        });
    });

    afterEach(() => {
        // Unmount while navigator.serviceWorker is still stubbed — the
        // component's cleanup reads it, and the auto afterEach cleanup()
        // from testing-library would otherwise run after the stub below
        // is torn down.
        cleanup();
        vi.unstubAllEnvs();
        vi.restoreAllMocks();
        Object.defineProperty(document, 'readyState', {
            value: originalReadyState,
            configurable: true,
        });
        delete (navigator as { serviceWorker?: unknown }).serviceWorker;
    });

    it('no-ops outside production', () => {
        const registration = createFakeRegistration();
        const sw = createFakeServiceWorkerContainer(() =>
            Promise.resolve(registration),
        );
        stubServiceWorker(sw);

        render(<ServiceWorkerRegister />);

        expect(sw.register).not.toHaveBeenCalled();
    });

    it('no-ops when serviceWorker is unsupported', () => {
        vi.stubEnv('NODE_ENV', 'production');

        expect(() => render(<ServiceWorkerRegister />)).not.toThrow();
    });

    it('prompts for update when a worker is already waiting', async () => {
        vi.stubEnv('NODE_ENV', 'production');
        const waitingWorker = createFakeWorker();
        const registration = createFakeRegistration(waitingWorker);
        const sw = createFakeServiceWorkerContainer(() =>
            Promise.resolve(registration),
        );
        sw.controller = {};
        stubServiceWorker(sw);

        render(<ServiceWorkerRegister />);

        await waitFor(() =>
            expect(sw.register).toHaveBeenCalledWith(
                '/sw.js',
                expect.objectContaining({ scope: '/', updateViaCache: 'none' }),
            ),
        );
        await waitFor(() =>
            expect(toast).toHaveBeenCalledWith(
                'Update available',
                expect.objectContaining({
                    action: expect.objectContaining({ label: 'Reload' }),
                }),
            ),
        );
    });

    it('prompts for update when a new worker installs while the page is open', async () => {
        vi.stubEnv('NODE_ENV', 'production');
        const registration = createFakeRegistration();
        const sw = createFakeServiceWorkerContainer(() =>
            Promise.resolve(registration),
        );
        sw.controller = {};
        stubServiceWorker(sw);

        render(<ServiceWorkerRegister />);
        await waitFor(() => expect(sw.register).toHaveBeenCalled());

        const installingWorker = createFakeWorker();
        registration.installing = installingWorker;
        act(() => registration.dispatchEvent(new Event('updatefound')));

        installingWorker.state = 'installed';
        act(() => installingWorker.dispatchEvent(new Event('statechange')));

        expect(toast).toHaveBeenCalledWith(
            'Update available',
            expect.anything(),
        );
    });

    it('reloads once when the controller changes', async () => {
        vi.stubEnv('NODE_ENV', 'production');
        const registration = createFakeRegistration();
        const sw = createFakeServiceWorkerContainer(() =>
            Promise.resolve(registration),
        );
        stubServiceWorker(sw);

        render(<ServiceWorkerRegister />);
        await waitFor(() => expect(sw.register).toHaveBeenCalled());

        act(() => {
            sw.dispatchEvent(new Event('controllerchange'));
            sw.dispatchEvent(new Event('controllerchange'));
        });

        expect(window.location.reload).toHaveBeenCalledTimes(1);
    });

    it('logs registration failures without throwing', async () => {
        vi.stubEnv('NODE_ENV', 'production');
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const sw = createFakeServiceWorkerContainer(() =>
            Promise.reject(new Error('nope')),
        );
        stubServiceWorker(sw);

        render(<ServiceWorkerRegister />);

        await waitFor(() =>
            expect(consoleError).toHaveBeenCalledWith(
                'Service worker registration failed:',
                expect.any(Error),
            ),
        );
    });

    it('stops reloading after unmount', async () => {
        vi.stubEnv('NODE_ENV', 'production');
        const registration = createFakeRegistration();
        const sw = createFakeServiceWorkerContainer(() =>
            Promise.resolve(registration),
        );
        stubServiceWorker(sw);

        const { unmount } = render(<ServiceWorkerRegister />);
        await waitFor(() => expect(sw.register).toHaveBeenCalled());

        unmount();
        act(() => sw.dispatchEvent(new Event('controllerchange')));

        expect(window.location.reload).not.toHaveBeenCalled();
    });
});
