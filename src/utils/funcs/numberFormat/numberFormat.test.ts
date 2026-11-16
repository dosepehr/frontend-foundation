import { describe, expect, it } from 'vitest';
import {
    addStep,
    caretFromEnd,
    clampNumber,
    countDecimals,
    countSignificantAfter,
    formatNumber,
    formatNumberString,
    groupThousands,
    parseNumber,
    sanitizeNumber,
    toLatinDigits,
} from '.';

describe('toLatinDigits', () => {
    it('converts Persian digits', () => {
        expect(toLatinDigits('۱۲۳۴۵۶۷۸۹۰')).toBe('1234567890');
    });

    it('converts Arabic-Indic digits', () => {
        expect(toLatinDigits('٠١٢٣٤٥٦٧٨٩')).toBe('0123456789');
    });

    it('converts the Arabic decimal mark to a point', () => {
        expect(toLatinDigits('۱٫۵')).toBe('1.5');
    });

    it('leaves Latin text untouched', () => {
        expect(toLatinDigits('abc 123')).toBe('abc 123');
    });
});

describe('groupThousands', () => {
    it('groups with a comma by default', () => {
        expect(groupThousands('1234567')).toBe('1,234,567');
    });

    it('uses a custom separator', () => {
        expect(groupThousands('1234567', ' ')).toBe('1 234 567');
    });

    it('does not group three digits or fewer', () => {
        expect(groupThousands('123')).toBe('123');
        expect(groupThousands('')).toBe('');
    });

    it('returns the input when the separator is empty', () => {
        expect(groupThousands('1234567', '')).toBe('1234567');
    });
});

describe('sanitizeNumber', () => {
    it('keeps digits only', () => {
        expect(sanitizeNumber('1a2b3')).toBe('123');
    });

    it('strips grouping separators', () => {
        expect(sanitizeNumber('1,234,567')).toBe('1234567');
    });

    it('keeps the first decimal point only', () => {
        expect(sanitizeNumber('1.2.3')).toBe('1.23');
    });

    it('keeps a trailing point while typing', () => {
        expect(sanitizeNumber('12.')).toBe('12.');
    });

    it('prefixes a bare point with zero', () => {
        expect(sanitizeNumber('.5')).toBe('0.5');
        expect(sanitizeNumber('-.5')).toBe('-0.5');
    });

    it('drops leading zeros', () => {
        expect(sanitizeNumber('007')).toBe('7');
        expect(sanitizeNumber('000')).toBe('0');
        expect(sanitizeNumber('00.5')).toBe('0.5');
    });

    it('keeps a leading minus, alone or with digits', () => {
        expect(sanitizeNumber('-')).toBe('-');
        expect(sanitizeNumber('-12')).toBe('-12');
    });

    it('ignores a minus that is not leading', () => {
        expect(sanitizeNumber('12-3')).toBe('123');
    });

    it('drops the minus when negatives are not allowed', () => {
        expect(sanitizeNumber('-12', { allowNegative: false })).toBe('12');
    });

    it('limits the fraction to decimalScale', () => {
        expect(sanitizeNumber('1.23456', { decimalScale: 2 })).toBe('1.23');
    });

    it('drops the point and fraction when decimalScale is 0', () => {
        expect(sanitizeNumber('1.5', { decimalScale: 0 })).toBe('1');
        expect(sanitizeNumber('1.', { decimalScale: 0 })).toBe('1');
    });

    it('converts Persian digits and decimal mark', () => {
        expect(sanitizeNumber('۱۲٫۵')).toBe('12.5');
    });

    it('returns an empty string for no digits', () => {
        expect(sanitizeNumber('abc')).toBe('');
        expect(sanitizeNumber('')).toBe('');
    });
});

describe('parseNumber', () => {
    it('parses integers and decimals', () => {
        expect(parseNumber('42')).toBe(42);
        expect(parseNumber('3.14')).toBe(3.14);
    });

    it('parses grouped input', () => {
        expect(parseNumber('1,234,567.89')).toBe(1234567.89);
    });

    it('parses a trailing point as the integer', () => {
        expect(parseNumber('12.')).toBe(12);
    });

    it('parses negatives', () => {
        expect(parseNumber('-5')).toBe(-5);
    });

    it('returns null when there are no digits', () => {
        expect(parseNumber('')).toBeNull();
        expect(parseNumber('-')).toBeNull();
        expect(parseNumber('abc')).toBeNull();
    });

    it('normalizes negative zero to zero', () => {
        expect(Object.is(parseNumber('-0'), 0)).toBe(true);
    });

    it('applies sanitize options', () => {
        expect(parseNumber('-5', { allowNegative: false })).toBe(5);
        expect(parseNumber('1.239', { decimalScale: 2 })).toBe(1.23);
    });

    it('parses Persian digits', () => {
        expect(parseNumber('۱٬۲۳۴')).toBe(1234);
    });
});

describe('formatNumberString', () => {
    it('groups the integer part only', () => {
        expect(formatNumberString('1234567.1234', ',')).toBe('1,234,567.1234');
    });

    it('keeps the minus sign and a trailing point', () => {
        expect(formatNumberString('-1234.', ',')).toBe('-1,234.');
    });

    it('does not group without a separator', () => {
        expect(formatNumberString('1234567')).toBe('1234567');
    });

    it('handles partial input', () => {
        expect(formatNumberString('', ',')).toBe('');
        expect(formatNumberString('-', ',')).toBe('-');
    });
});

describe('formatNumber', () => {
    it('returns an empty string for null and non-finite values', () => {
        expect(formatNumber(null)).toBe('');
        expect(formatNumber(Number.NaN)).toBe('');
        expect(formatNumber(Number.POSITIVE_INFINITY)).toBe('');
    });

    it('formats without grouping by default', () => {
        expect(formatNumber(1234567.5)).toBe('1234567.5');
    });

    it('groups with a separator', () => {
        expect(formatNumber(-1234567.5, { thousandSeparator: ',' })).toBe(
            '-1,234,567.5',
        );
    });

    it('rounds to decimalScale', () => {
        expect(formatNumber(1.236, { decimalScale: 2 })).toBe('1.24');
        expect(formatNumber(1.5, { decimalScale: 0 })).toBe('2');
    });

    it('does not pad unless fixedDecimalScale is set', () => {
        expect(formatNumber(1.5, { decimalScale: 2 })).toBe('1.5');
        expect(
            formatNumber(1.5, { decimalScale: 2, fixedDecimalScale: true }),
        ).toBe('1.50');
    });

    it('never uses exponent notation', () => {
        expect(formatNumber(1e21)).toBe('1000000000000000000000');
        expect(formatNumber(0.0000001)).toBe('0.0000001');
    });
});

describe('countDecimals', () => {
    it('counts fraction digits', () => {
        expect(countDecimals(1)).toBe(0);
        expect(countDecimals(0.25)).toBe(2);
        expect(countDecimals(1e-7)).toBe(7);
    });

    it('returns 0 for non-finite values', () => {
        expect(countDecimals(Number.NaN)).toBe(0);
    });
});

describe('clampNumber', () => {
    it('clamps to both bounds', () => {
        expect(clampNumber(5, 0, 10)).toBe(5);
        expect(clampNumber(-1, 0, 10)).toBe(0);
        expect(clampNumber(11, 0, 10)).toBe(10);
    });

    it('allows either bound to be omitted', () => {
        expect(clampNumber(-100, undefined, 10)).toBe(-100);
        expect(clampNumber(100, 0)).toBe(100);
    });
});

describe('addStep', () => {
    it('adds without floating-point noise', () => {
        expect(addStep(0.1, 0.2)).toBe(0.3);
        expect(addStep(1.1, -0.1)).toBe(1);
    });

    it('adds integer steps', () => {
        expect(addStep(5, 10)).toBe(15);
    });
});

describe('caret helpers', () => {
    it('counts significant characters after an index', () => {
        expect(countSignificantAfter('1,234', 2)).toBe(3);
        expect(countSignificantAfter('-1,234.5', 0)).toBe(7);
        expect(countSignificantAfter('۱۲۳', 1)).toBe(2);
    });

    it('places the caret before the same number of significant characters', () => {
        // Typing "5" into "1,2|34" regroups to "12,534"; the caret stays
        // after the new digit, before the two digits that followed it.
        expect(caretFromEnd('12,534', 2)).toBe(4);
        expect(caretFromEnd('1,234', 0)).toBe(5);
        expect(caretFromEnd('1,234', 4)).toBe(0);
    });

    it('stops at the start when asked for more characters than exist', () => {
        expect(caretFromEnd('12', 5)).toBe(0);
    });
});
