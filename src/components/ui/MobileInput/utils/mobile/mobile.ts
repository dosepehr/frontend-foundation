import { toLatinDigits } from '@/utils/funcs/numberFormat';

/** Digits of a mobile number after the leading 0, e.g. `912 123 4567`. */
const NATIONAL_LENGTH = 10;
const COUNTRY_CODE = '98';

/** Characters kept while typing: digits, a `+` prefix and separators. */
export function sanitizeMobileText(text: string) {
    return toLatinDigits(text)
        .replace(/[^\d+\s()-]/g, '')
        .replace(/(?!^)\+/g, '');
}

/**
 * Normalizes an Iranian mobile number to `09xxxxxxxxx`, accepting Persian and
 * Arabic digits, separators and the `+98`, `0098`, `98` and `0` prefixes.
 * Returns '' when there are no digits; a partial number stays partial.
 */
export function normalizeMobile(text: string) {
    const latin = toLatinDigits(text).trim();
    let digits = latin.replace(/\D/g, '');
    const international = latin.startsWith('+') || digits.startsWith('00');

    digits = digits.replace(/^0+/, '');
    // A bare `98…` is only a country code once it is longer than a national
    // number, so `0998…` typed without the 0 isn't mistaken for one.
    if (
        digits.startsWith(COUNTRY_CODE) &&
        (international || digits.length > NATIONAL_LENGTH)
    ) {
        digits = digits.slice(COUNTRY_CODE.length).replace(/^0+/, '');
    }

    return digits ? `0${digits.slice(0, NATIONAL_LENGTH)}` : '';
}

/** Groups a normalized number as `0912 123 4567`; partial numbers too. */
export function formatMobile(value: string, separator = ' ') {
    if (!separator) return value;
    return [value.slice(0, 4), value.slice(4, 7), value.slice(7)]
        .filter(Boolean)
        .join(separator);
}

/** Whether a normalized value is a complete mobile number (`09` + 9 digits). */
export function isValidMobile(value: string) {
    return /^09\d{9}$/.test(value);
}
