import type { ResendTimerLocale } from '../../ResendTimer.types';

const toPersianDigits = (value: string) =>
    value.replace(/\d/g, (digit) => String.fromCharCode(0x06f0 + +digit));

/** Seconds as "m:ss", e.g. 59 → "0:59" (or "۰:۵۹" in Persian). */
export function formatCountdown(
    seconds: number,
    locale: ResendTimerLocale = 'en',
) {
    const safe = Math.max(0, Math.ceil(seconds));
    const time = `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
    return locale === 'fa' ? toPersianDigits(time) : time;
}
