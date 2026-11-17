// Helpers for "HH:mm" / "HH:mm:ss" time strings (24-hour, zero-padded).

export type TimeParts = { hours: number; minutes: number; seconds: number };
export type HourCycle = 12 | 24;
export type DayPeriod = 'AM' | 'PM';

const TIME_PATTERN = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;

export const pad = (value: number) => String(value).padStart(2, '0');

/** Parses "H:mm", "HH:mm" or "HH:mm:ss"; returns null for anything invalid. */
export function parseTime(value?: string | null): TimeParts | null {
    const match = value ? TIME_PATTERN.exec(value.trim()) : null;
    if (!match) return null;
    const [hours, minutes, seconds = 0] = match
        .slice(1)
        .map((part) => (part === undefined ? 0 : Number(part)));
    if (hours > 23 || minutes > 59 || seconds > 59) return null;
    return { hours, minutes, seconds };
}

/** Formats parts as "HH:mm", or "HH:mm:ss" with `showSeconds`. */
export function formatTime(
    { hours, minutes, seconds }: TimeParts,
    { showSeconds = false }: { showSeconds?: boolean } = {},
) {
    const time = `${pad(hours)}:${pad(minutes)}`;
    return showSeconds ? `${time}:${pad(seconds)}` : time;
}

/** Converts 0–23 to a 12-hour clock hour (1–12) and period. */
export function to12Hour(hours: number): { hour: number; period: DayPeriod } {
    return { hour: hours % 12 || 12, period: hours < 12 ? 'AM' : 'PM' };
}

/** Converts a 12-hour clock hour (1–12) and period to 0–23. */
export function from12Hour(hour: number, period: DayPeriod) {
    return (hour % 12) + (period === 'PM' ? 12 : 0);
}

/** Display text for a time value, e.g. "14:05" or "2:05 PM". */
export function formatTimeLabel(
    value?: string | null,
    {
        hourCycle = 24,
        showSeconds = false,
    }: { hourCycle?: HourCycle; showSeconds?: boolean } = {},
) {
    const parts = parseTime(value);
    if (!parts) return '';
    if (hourCycle === 24) return formatTime(parts, { showSeconds });
    const { hour, period } = to12Hour(parts.hours);
    const seconds = showSeconds ? `:${pad(parts.seconds)}` : '';
    return `${hour}:${pad(parts.minutes)}${seconds} ${period}`;
}

/** Values from 0 up to (not including) `count`, `step` apart. */
export function timeSteps(count: number, step = 1) {
    const safeStep = Math.max(1, Math.floor(step));
    return Array.from(
        { length: Math.ceil(count / safeStep) },
        (_, index) => index * safeStep,
    );
}

/** Applies `patch` to a time value; an empty value starts from 00:00:00. */
export function updateTime(
    value: string | null | undefined,
    patch: Partial<TimeParts>,
    options?: { showSeconds?: boolean },
) {
    const base = parseTime(value) ?? { hours: 0, minutes: 0, seconds: 0 };
    return formatTime({ ...base, ...patch }, options);
}
