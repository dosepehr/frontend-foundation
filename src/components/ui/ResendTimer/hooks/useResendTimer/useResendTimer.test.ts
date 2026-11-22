import { act, renderHook } from '@testing-library/react';
import { useResendTimer } from './useResendTimer';

const finishWait = () => act(() => vi.advanceTimersByTime(2000));

describe('useResendTimer', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('restarts the wait after a successful send', async () => {
        const onResend = vi.fn(() => Promise.resolve());
        const { result } = renderHook(() =>
            useResendTimer({ seconds: 2, onResend }),
        );
        finishWait();
        expect(result.current.isDone).toBe(true);

        await act(() => result.current.resend());
        expect(onResend).toHaveBeenCalledTimes(1);
        expect(result.current.remaining).toBe(2);
        expect(result.current.isSending).toBe(false);
    });

    it('is busy while the send is pending', async () => {
        let finish: (() => void) | undefined;
        const onResend = vi.fn(
            () => new Promise<void>((resolve) => (finish = resolve)),
        );
        const { result } = renderHook(() =>
            useResendTimer({ seconds: 2, onResend }),
        );
        finishWait();

        let pending: Promise<void> = Promise.resolve();
        act(() => {
            pending = result.current.resend();
        });
        expect(result.current.isSending).toBe(true);

        await act(async () => {
            finish?.();
            await pending;
        });
        expect(result.current.isSending).toBe(false);
    });

    it('accepts a sync onResend', async () => {
        const onResend = vi.fn();
        const { result } = renderHook(() =>
            useResendTimer({ seconds: 2, onResend }),
        );
        finishWait();
        await act(() => result.current.resend());
        expect(result.current.isDone).toBe(false);
    });

    it('keeps the button available and reports a failed send', async () => {
        const error = new Error('SMS failed');
        const onError = vi.fn();
        const { result } = renderHook(() =>
            useResendTimer({
                seconds: 2,
                onResend: () => Promise.reject(error),
                onError,
            }),
        );
        finishWait();

        await act(() => result.current.resend());
        expect(onError).toHaveBeenCalledWith(error);
        expect(result.current.isDone).toBe(true);
        expect(result.current.isSending).toBe(false);
    });

    it('rethrows a failed send without onError', async () => {
        const error = new Error('SMS failed');
        const { result } = renderHook(() =>
            useResendTimer({
                seconds: 2,
                onResend: () => Promise.reject(error),
            }),
        );
        finishWait();

        await act(() => expect(result.current.resend()).rejects.toBe(error));
        expect(result.current.isDone).toBe(true);
    });
});
