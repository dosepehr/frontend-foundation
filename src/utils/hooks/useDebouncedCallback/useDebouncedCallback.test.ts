import { act, renderHook } from '@testing-library/react';
import { useDebouncedCallback } from '.';

describe('useDebouncedCallback', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('runs once with the last arguments after the delay', () => {
        const callback = vi.fn();
        const { result } = renderHook(() =>
            useDebouncedCallback(callback, 300),
        );

        act(() => {
            result.current.run('a');
            result.current.run('ab');
        });
        expect(callback).not.toHaveBeenCalled();

        act(() => vi.advanceTimersByTime(300));
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith('ab');
    });

    it('restarts the delay on every call', () => {
        const callback = vi.fn();
        const { result } = renderHook(() =>
            useDebouncedCallback(callback, 300),
        );

        act(() => result.current.run(1));
        act(() => vi.advanceTimersByTime(200));
        act(() => result.current.run(2));
        act(() => vi.advanceTimersByTime(200));
        expect(callback).not.toHaveBeenCalled();

        act(() => vi.advanceTimersByTime(100));
        expect(callback).toHaveBeenCalledWith(2);
    });

    it('flushes a pending call right away', () => {
        const callback = vi.fn();
        const { result } = renderHook(() =>
            useDebouncedCallback(callback, 300),
        );

        act(() => result.current.run('now'));
        act(() => result.current.flush());

        expect(callback).toHaveBeenCalledWith('now');
        act(() => vi.advanceTimersByTime(300));
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('does nothing when flushing without a pending call', () => {
        const callback = vi.fn();
        const { result } = renderHook(() =>
            useDebouncedCallback(callback, 300),
        );

        act(() => result.current.flush());

        expect(callback).not.toHaveBeenCalled();
    });

    it('cancels a pending call', () => {
        const callback = vi.fn();
        const { result } = renderHook(() =>
            useDebouncedCallback(callback, 300),
        );

        act(() => result.current.run('x'));
        act(() => result.current.cancel());
        act(() => vi.advanceTimersByTime(300));

        expect(callback).not.toHaveBeenCalled();
    });

    it('uses the latest callback', () => {
        const first = vi.fn();
        const second = vi.fn();
        const { result, rerender } = renderHook(
            ({ callback }) => useDebouncedCallback(callback, 100),
            { initialProps: { callback: first } },
        );

        act(() => result.current.run());
        rerender({ callback: second });
        act(() => vi.advanceTimersByTime(100));

        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalled();
    });

    it('drops a pending call on unmount', () => {
        const callback = vi.fn();
        const { result, unmount } = renderHook(() =>
            useDebouncedCallback(callback, 100),
        );

        act(() => result.current.run());
        unmount();
        act(() => vi.advanceTimersByTime(100));

        expect(callback).not.toHaveBeenCalled();
    });
});
