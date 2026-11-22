import { act, renderHook } from '@testing-library/react';
import { useCountdown } from './useCountdown';

describe('useCountdown', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('counts down to zero and stops', () => {
        const { result } = renderHook(() => useCountdown(3));
        expect(result.current.remaining).toBe(3);
        expect(result.current.isDone).toBe(false);

        act(() => vi.advanceTimersByTime(1000));
        expect(result.current.remaining).toBe(2);

        act(() => vi.advanceTimersByTime(2000));
        expect(result.current.remaining).toBe(0);
        expect(result.current.isDone).toBe(true);
        expect(vi.getTimerCount()).toBe(0);
    });

    it('follows the clock after a throttled gap', () => {
        const { result } = renderHook(() => useCountdown(60));
        // A background tab may skip ticks; the next one catches up.
        vi.setSystemTime(Date.now() + 45_000);
        act(() => vi.advanceTimersByTime(250));
        expect(result.current.remaining).toBe(15);
    });

    it('restarts the wait', () => {
        const { result } = renderHook(() => useCountdown(2));
        act(() => vi.advanceTimersByTime(2000));
        expect(result.current.isDone).toBe(true);

        act(() => result.current.restart());
        expect(result.current.remaining).toBe(2);
        act(() => vi.advanceTimersByTime(1000));
        expect(result.current.remaining).toBe(1);
    });

    it('is done at once for zero seconds', () => {
        const { result } = renderHook(() => useCountdown(0));
        expect(result.current.isDone).toBe(true);
        expect(vi.getTimerCount()).toBe(0);
    });
});
