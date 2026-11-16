// Helpers for number inputs: parse what a user types (in any digit script,
// with or without grouping separators) and format numbers back for display.
// The decimal separator is always '.', so never use '.' as a thousand separator.

export type NumberFormatOptions = {
    /** Character inserted between groups of three integer digits. */
    thousandSeparator?: string;
    /** Maximum number of fraction digits. `0` disallows decimals. */
    decimalScale?: number;
    /** Pads the fraction with zeros up to `decimalScale`. */
    fixedDecimalScale?: boolean;
    /** Keeps a leading minus sign. */
    allowNegative?: boolean;
};

const PERSIAN_ZERO = 0x06f0;
const ARABIC_ZERO = 0x0660;

/** Converts Persian and Arabic-Indic digits and decimal marks to Latin. */
export function toLatinDigits(value: string) {
    return value
        .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - PERSIAN_ZERO))
        .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - ARABIC_ZERO))
        .replace(/٫/g, '.');
}

/** Inserts `separator` between every three digits of an integer string. */
export function groupThousands(integer: string, separator = ',') {
    if (!separator) return integer;
    return integer.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

/**
 * Cleans raw input into a partial number string that may still be mid-typing:
 * `''`, `'-'`, `'12.'`, `'-0.5'`. Drops every character that is not a digit,
 * the first '.', or a leading '-'.
 */
export function sanitizeNumber(
    raw: string,
    {
        allowNegative = true,
        decimalScale,
    }: Pick<NumberFormatOptions, 'allowNegative' | 'decimalScale'> = {},
) {
    const latin = toLatinDigits(raw).trim();
    const negative = allowNegative && latin.startsWith('-');
    const [rawInteger = '', ...rest] = latin.replace(/[^\d.]/g, '').split('.');
    const hasPoint = rest.length > 0 && decimalScale !== 0;

    let integer = rawInteger.replace(/^0+(?=\d)/, '');
    if (hasPoint && integer === '') integer = '0';

    let fraction = rest.join('');
    if (decimalScale !== undefined) fraction = fraction.slice(0, decimalScale);

    return `${negative ? '-' : ''}${integer}${hasPoint ? `.${fraction}` : ''}`;
}

/** Parses user input into a number, or `null` when it holds no digits. */
export function parseNumber(
    raw: string,
    options?: Pick<NumberFormatOptions, 'allowNegative' | 'decimalScale'>,
) {
    const clean = sanitizeNumber(raw, options);
    if (!/\d/.test(clean)) return null;
    const value = Number(clean);
    // Normalizes -0 to 0.
    return value === 0 ? 0 : value;
}

/** Groups the integer part of an already sanitized number string. */
export function formatNumberString(clean: string, thousandSeparator = '') {
    const negative = clean.startsWith('-');
    const [integer = '', fraction] = (negative ? clean.slice(1) : clean).split(
        '.',
    );
    return `${negative ? '-' : ''}${groupThousands(integer, thousandSeparator)}${
        fraction !== undefined ? `.${fraction}` : ''
    }`;
}

/** Formats a number for display; `null` and non-finite values become ''. */
export function formatNumber(
    value: number | null | undefined,
    {
        thousandSeparator = '',
        decimalScale,
        fixedDecimalScale = false,
    }: NumberFormatOptions = {},
) {
    if (value === null || value === undefined || !Number.isFinite(value)) {
        return '';
    }
    // toLocaleString avoids the exponent notation String() uses for big numbers.
    const plain = value.toLocaleString('en-US', {
        useGrouping: false,
        maximumFractionDigits: decimalScale ?? 20,
        minimumFractionDigits: fixedDecimalScale ? (decimalScale ?? 0) : 0,
    });
    return formatNumberString(plain, thousandSeparator);
}

/** Number of digits after the decimal point. */
export function countDecimals(value: number) {
    if (!Number.isFinite(value)) return 0;
    const [, fraction = ''] = formatNumber(value).split('.');
    return fraction.length;
}

/** Restricts `value` to `[min, max]`; either bound may be omitted. */
export function clampNumber(value: number, min?: number, max?: number) {
    if (min !== undefined && value < min) return min;
    if (max !== undefined && value > max) return max;
    return value;
}

/** Adds `step` to `value` without floating-point noise (0.1 + 0.2 = 0.3). */
export function addStep(value: number, step: number) {
    const precision = Math.max(countDecimals(value), countDecimals(step));
    return Number((value + step).toFixed(precision));
}

const SIGNIFICANT = /[\d.\-۰-۹٠-٩٫]/;

/** Counts characters that survive formatting from `index` to the end. */
export function countSignificantAfter(text: string, index: number) {
    return [...text.slice(index)].filter((char) => SIGNIFICANT.test(char))
        .length;
}

/**
 * Caret position in `formatted` that leaves `significantAfter` significant
 * characters after it, so the caret stays put when separators shift.
 */
export function caretFromEnd(formatted: string, significantAfter: number) {
    let remaining = significantAfter;
    for (let index = formatted.length; index > 0; index -= 1) {
        if (remaining === 0) return index;
        if (SIGNIFICANT.test(formatted[index - 1])) remaining -= 1;
    }
    return 0;
}
