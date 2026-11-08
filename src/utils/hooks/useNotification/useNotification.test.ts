import { act, renderHook } from '@testing-library/react';
import { toast } from 'sonner';
import { useNotification } from '.';

vi.mock('sonner', () => ({ toast: { error: vi.fn() } }));

const noopAsync = async () => {};

async function currentPermission() {
    return FakeNotification.permission;
}

// happy-dom ships neither the Notification API nor navigator.serviceWorker,
// so each test installs the fakes it needs.
class FakeNotification {
    static permission: NotificationPermission = 'default';
    static requestPermission = vi.fn(currentPermission);
    static shown: { title: string; options?: NotificationOptions }[] = [];

    constructor(title: string, options?: NotificationOptions) {
        FakeNotification.shown.push({ title, options });
    }
}

const installNotification = (permission: NotificationPermission) => {
    FakeNotification.permission = permission;
    Object.defineProperty(window, 'Notification', {
        value: FakeNotification,
        configurable: true,
        writable: true,
    });
};

describe('useNotification', () => {
    let play: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        FakeNotification.shown = [];
        FakeNotification.requestPermission.mockClear();
        play = vi
            .spyOn(window.HTMLMediaElement.prototype, 'play')
            .mockImplementation(noopAsync);
    });

    afterEach(() => {
        Reflect.deleteProperty(window, 'Notification');
        Reflect.deleteProperty(navigator, 'serviceWorker');
        vi.clearAllMocks();
        play.mockRestore();
    });

    it('reports unsupported browsers without throwing', async () => {
        const { result } = renderHook(() => useNotification());

        expect(result.current.permission).toBe('unsupported');
        await expect(result.current.requestPermission()).resolves.toBe(
            'unsupported',
        );
        await expect(result.current.notify('hi')).resolves.toEqual({
            ok: false,
            reason: 'unsupported',
        });
        expect(toast.error).toHaveBeenCalledTimes(1);
    });

    it('shows a page-level notification and plays the sound when granted', async () => {
        installNotification('granted');
        const { result } = renderHook(() => useNotification());

        expect(result.current.permission).toBe('granted');
        let outcome;
        await act(async () => {
            outcome = await result.current.notify('Saved', { title: 'Done' });
        });

        expect(outcome).toEqual({ ok: true });
        expect(FakeNotification.shown).toEqual([
            {
                title: 'Done',
                options: expect.objectContaining({
                    body: 'Saved',
                    icon: '/pwa/icon-192.png',
                }),
            },
        ]);
        expect(play).toHaveBeenCalledTimes(1);
    });

    it('asks for permission first and stops when the user denies it', async () => {
        installNotification('default');
        FakeNotification.requestPermission.mockResolvedValueOnce('denied');
        const { result } = renderHook(() => useNotification());

        await expect(result.current.notify('hi')).resolves.toEqual({
            ok: false,
            reason: 'denied',
        });
        expect(FakeNotification.requestPermission).toHaveBeenCalledTimes(1);
        expect(toast.error).toHaveBeenCalledTimes(1);
        expect(FakeNotification.shown).toHaveLength(0);
        expect(play).not.toHaveBeenCalled();
    });

    it('prefers the service worker registration when one exists', async () => {
        installNotification('granted');
        const showNotification = vi.fn(noopAsync);
        Object.defineProperty(navigator, 'serviceWorker', {
            value: { getRegistration: async () => ({ showNotification }) },
            configurable: true,
        });
        const { result } = renderHook(() => useNotification());

        await act(async () => {
            await result.current.notify('From SW');
        });

        expect(showNotification).toHaveBeenCalledWith(
            'Notification',
            expect.objectContaining({ body: 'From SW' }),
        );
        expect(FakeNotification.shown).toHaveLength(0);
    });

    it('delegates requestPermission to the browser', async () => {
        installNotification('default');
        FakeNotification.requestPermission.mockResolvedValueOnce('granted');
        const { result } = renderHook(() => useNotification());

        await expect(result.current.requestPermission()).resolves.toBe(
            'granted',
        );
    });
});
