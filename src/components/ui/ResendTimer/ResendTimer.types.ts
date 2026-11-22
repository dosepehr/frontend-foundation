import type { ReactNode } from 'react';

export type ResendTimerLocale = 'en' | 'fa';

export type ResendTimerLabels = {
    /** Button text once the wait is over. */
    resend: string;
    /** Button text while `onResend` is pending. */
    sending: string;
    /** Text while waiting; `time` is the formatted "0:59". */
    countdown: (time: ReactNode) => ReactNode;
};

export type ResendTimerProps = {
    /**
     * Sends a new code. Return a promise to keep the button busy: the wait
     * restarts when it resolves and not when it rejects.
     */
    onResend: () => unknown;
    /** Receives a rejection of `onResend`; without it the error is rethrown. */
    onError?: (error: unknown) => void;
    /** Seconds before the code can be resent; counting starts on mount. */
    seconds?: number;
    /** Copy and digits of the default labels. */
    locale?: ResendTimerLocale;
    labels?: Partial<ResendTimerLabels>;
    disabled?: boolean;
    className?: string;
};
