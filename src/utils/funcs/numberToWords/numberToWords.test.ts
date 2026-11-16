import { describe, expect, it } from 'vitest';
import { numberToEnglishWords, numberToPersianWords, numberToWords } from '.';

describe('numberToPersianWords', () => {
    it('writes small numbers', () => {
        expect(numberToPersianWords(0)).toBe('صفر');
        expect(numberToPersianWords(7)).toBe('هفت');
        expect(numberToPersianWords(25)).toBe('بیست و پنج');
    });

    it('writes 1000 as «هزار», not «یک هزار»', () => {
        expect(numberToPersianWords(1000)).toBe('هزار');
        expect(numberToPersianWords(1500)).toBe('هزار و پانصد');
        expect(numberToPersianWords(-1000)).toBe('منفی هزار');
    });

    it('keeps «یک» when it is not leading', () => {
        expect(numberToPersianWords(101_000)).toBe('صد و یک هزار');
        expect(numberToPersianWords(1_000_000)).toBe('یک میلیون');
    });

    it('writes large numbers', () => {
        expect(numberToPersianWords(1_250_000)).toBe(
            'یک میلیون و دویست و پنجاه هزار',
        );
        expect(numberToPersianWords(3_000_000_000)).toBe('سه میلیارد');
    });

    it('writes decimals and negatives', () => {
        expect(numberToPersianWords(12.5)).toBe('دوازده و پنج دهم');
        expect(numberToPersianWords(-3)).toBe('منفی سه');
    });

    it('returns an empty string for null and non-finite values', () => {
        expect(numberToPersianWords(null)).toBe('');
        expect(numberToPersianWords(Number.NaN)).toBe('');
        expect(numberToPersianWords(Number.POSITIVE_INFINITY)).toBe('');
    });
});

describe('numberToEnglishWords', () => {
    it('writes numbers in lower case', () => {
        expect(numberToEnglishWords(0)).toBe('zero');
        expect(numberToEnglishWords(1000)).toBe('one thousand');
        expect(numberToEnglishWords(1_250_000)).toBe(
            'one million two hundred fifty thousand',
        );
    });

    it('writes decimals and negatives', () => {
        expect(numberToEnglishWords(12.5)).toBe('twelve point five');
        expect(numberToEnglishWords(-3)).toBe('minus three');
    });

    it('returns an empty string for null and non-finite values', () => {
        expect(numberToEnglishWords(null)).toBe('');
        expect(numberToEnglishWords(Number.NaN)).toBe('');
    });
});

describe('numberToWords', () => {
    it('defaults to English without a unit', () => {
        expect(numberToWords(1000)).toBe('one thousand');
    });

    it('writes Persian with a unit', () => {
        expect(numberToWords(1000, { language: 'fa', unit: 'تومان' })).toBe(
            'هزار تومان',
        );
    });

    it('writes English with a unit', () => {
        expect(numberToWords(20, { language: 'en', unit: 'dollars' })).toBe(
            'twenty dollars',
        );
    });

    it('returns an empty string without a value, even with a unit', () => {
        expect(numberToWords(null, { language: 'fa', unit: 'تومان' })).toBe('');
    });
});
