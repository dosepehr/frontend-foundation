import { act, renderHook } from '@testing-library/react';
import { useIsMobile } from '.';

function setupMatchMedia(innerWidth: number) {
    const listeners: Array<() => void> = [];

    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: innerWidth,
    });

    vi.stubGlobal('matchMedia', () => ({
        matches: false,
        addEventListener: (_event: string, cb: () => void) =>
            listeners.push(cb),
        removeEventListener: (_event: string, cb: () => void) => {
            const idx = listeners.indexOf(cb);
            if (idx !== -1) listeners.splice(idx, 1);
        },
    }));

    const triggerResize = (newWidth: number) => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: newWidth,
        });
        act(() => {
            for (const l of listeners) l();
        });
    };

    return { triggerResize };
}

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('useIsMobile', () => {
    it('returns false when window.innerWidth is above the default breakpoint (1280)', () => {
        setupMatchMedia(1440);
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);
    });

    it('returns true when window.innerWidth is below the default breakpoint (1280)', () => {
        setupMatchMedia(768);
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(true);
    });

    it('returns false when width equals the breakpoint (not strictly less than)', () => {
        setupMatchMedia(1280);
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);
    });

    it('returns true when width is exactly one below the breakpoint', () => {
        setupMatchMedia(1279);
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(true);
    });

    it('updates to true when viewport shrinks below the breakpoint', () => {
        const { triggerResize } = setupMatchMedia(1440);
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);
        triggerResize(600);
        expect(result.current).toBe(true);
    });

    it('updates to false when viewport grows above the breakpoint', () => {
        const { triggerResize } = setupMatchMedia(375);
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(true);
        triggerResize(1440);
        expect(result.current).toBe(false);
    });

    it('respects a custom breakpoint', () => {
        setupMatchMedia(500);
        const { result } = renderHook(() => useIsMobile(768));
        expect(result.current).toBe(true);
    });

    it('returns false for custom breakpoint when width is above it', () => {
        setupMatchMedia(1024);
        const { result } = renderHook(() => useIsMobile(768));
        expect(result.current).toBe(false);
    });

    it('updates correctly with a custom breakpoint on resize', () => {
        const { triggerResize } = setupMatchMedia(1024);
        const { result } = renderHook(() => useIsMobile(768));
        expect(result.current).toBe(false);
        triggerResize(400);
        expect(result.current).toBe(true);
    });
});
