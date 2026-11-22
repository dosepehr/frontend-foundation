'use client';

import { useState } from 'react';
import type { ResendTimerProps } from '../../ResendTimer.types';
import { useCountdown } from '../useCountdown/useCountdown';

type UseResendTimerOptions = Pick<ResendTimerProps, 'onResend' | 'onError'> & {
    seconds: number;
};

/** The wait before a resend, and the resend itself with its busy state. */
export function useResendTimer({
    seconds,
    onResend,
    onError,
}: UseResendTimerOptions) {
    const { remaining, isDone, restart } = useCountdown(seconds);
    const [isSending, setIsSending] = useState(false);

    const resend = async () => {
        setIsSending(true);
        try {
            await onResend();
            restart();
        } catch (error) {
            // A failed send keeps the button available for another try.
            if (!onError) throw error;
            onError(error);
        } finally {
            setIsSending(false);
        }
    };

    return { remaining, isDone, isSending, resend };
}
