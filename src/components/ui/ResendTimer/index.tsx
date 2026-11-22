/* c8 ignore start */
'use client';
/* c8 ignore stop */

import Button from '@/components/ui/Button';
import { cn } from '@/utils/funcs/cn';
import { useResendTimer } from './hooks/useResendTimer/useResendTimer';
import type {
    ResendTimerLabels,
    ResendTimerLocale,
    ResendTimerProps,
} from './ResendTimer.types';
import { formatCountdown } from './utils/formatCountdown/formatCountdown';

const LABELS: Record<ResendTimerLocale, ResendTimerLabels> = {
    en: {
        resend: 'Resend code',
        sending: 'Sending...',
        countdown: (time) => <>Resend code in {time}</>,
    },
    fa: {
        resend: 'ارسال مجدد کد',
        sending: 'در حال ارسال...',
        countdown: (time) => <>{time} تا ارسال مجدد کد</>,
    },
};

// The wait before an OTP can be resent, then a resend button. Place it next
// to the OtpInput; remount it (change its `key`) to restart from outside.
const ResendTimer = ({
    onResend,
    onError,
    seconds = 60,
    locale = 'en',
    labels,
    disabled = false,
    className,
}: ResendTimerProps) => {
    const text = { ...LABELS[locale], ...labels };
    const { remaining, isDone, isSending, resend } = useResendTimer({
        seconds,
        onResend,
        onError,
    });

    return (
        // Announces the swap to the button; the timer itself stays silent.
        <div
            data-slot="resend-timer"
            aria-live="polite"
            className={cn('flex min-h-7 items-center text-sm', className)}
        >
            {isDone ? (
                <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="px-0"
                    disabled={disabled}
                    isLoading={isSending}
                    loadingText={text.sending}
                    onClick={resend}
                >
                    {text.resend}
                </Button>
            ) : (
                <span role="timer" className="text-muted-foreground">
                    {text.countdown(
                        <span dir="ltr" className="tabular-nums">
                            {formatCountdown(remaining, locale)}
                        </span>,
                    )}
                </span>
            )}
        </div>
    );
};

export default ResendTimer;
