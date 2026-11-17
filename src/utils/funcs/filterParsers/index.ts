// nuqs parsers that keep filter values in the URL, plus helpers that turn
// range values into flat API params. Dates are written as local
// "yyyy-MM-dd" days (Gregorian, also under a Jalali calendar).
import type { FilterType, NumberRange } from '@/utils/funcs/filters';
import { createParser, parseAsArrayOf, parseAsString } from 'nuqs';
import type { DateRange } from 'react-day-picker';

const pad = (value: number) => String(value).padStart(2, '0');

/** A date as a local "yyyy-MM-dd" day. */
export const toIsoDay = (date: Date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** A local "yyyy-MM-dd" day as a date; undefined when invalid. */
export function fromIsoDay(value: string | undefined) {
    const match = value ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
    if (!match) return;
    const [year, month, day] = match.slice(1).map(Number);
    const date = new Date(year, month - 1, day);
    // Rejects days that roll over, like 2026-02-31.
    return date.getMonth() === month - 1 && date.getDate() === day
        ? date
        : undefined;
}

const sameDay = (a?: Date, b?: Date) =>
    a === b || (!!a && !!b && toIsoDay(a) === toIsoDay(b));

/** "2026-01-05,2026-01-09" ⇄ { from, to }; the end may be empty. */
export const parseAsDateRange = createParser<DateRange>({
    parse: (value) => {
        const [from, to] = value.split(',');
        const start = fromIsoDay(from);
        return start ? { from: start, to: fromIsoDay(to) } : null;
    },
    serialize: (range) =>
        range.from
            ? `${toIsoDay(range.from)},${range.to ? toIsoDay(range.to) : ''}`
            : '',
    eq: (a, b) => sameDay(a.from, b.from) && sameDay(a.to, b.to),
});

const parseNumber = (value: string | undefined) => {
    if (!value) return;
    const number = Number(value);
    return Number.isFinite(number) ? number : undefined;
};

/** "10,200" ⇄ { from: 10, to: 200 }; either end may be empty. */
export const parseAsNumberRange = createParser<NumberRange>({
    parse: (value) => {
        const [from, to] = value.split(',').map(parseNumber);
        return from === undefined && to === undefined ? null : { from, to };
    },
    serialize: ({ from, to }) => `${from ?? ''},${to ?? ''}`,
    eq: (a, b) => a.from === b.from && a.to === b.to,
});

/** The URL parser of each filter type. */
export const filterParsers = {
    select: parseAsString,
    text: parseAsString,
    multiselect: parseAsArrayOf(parseAsString),
    date: parseAsDateRange,
    'number-range': parseAsNumberRange,
} satisfies Record<FilterType, unknown>;

/**
 * A date range as flat API params, e.g.
 * `{ start_date_from: '2026-01-05', end_date_to: '2026-01-09' }`.
 */
export function dateRangeParams(
    range: DateRange | null | undefined,
    fromKey: string,
    toKey: string,
) {
    const params: Record<string, string> = {};
    if (range?.from) params[fromKey] = toIsoDay(range.from);
    if (range?.to) params[toKey] = toIsoDay(range.to);
    return params;
}

/** A number range as flat API params, e.g. `{ price_min: 10, price_max: 200 }`. */
export function numberRangeParams(
    range: NumberRange | null | undefined,
    fromKey: string,
    toKey: string,
) {
    const params: Record<string, number> = {};
    if (range?.from !== undefined) params[fromKey] = range.from;
    if (range?.to !== undefined) params[toKey] = range.to;
    return params;
}
