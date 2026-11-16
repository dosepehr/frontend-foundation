import { ToWords as EnglishToWords } from 'to-words/en-US';
import { ToWords as PersianToWords } from 'to-words/fa-IR';

export type WordsLanguage = 'fa' | 'en';

const persian = new PersianToWords();
const english = new EnglishToWords();

const isConvertible = (value: number | null | undefined): value is number =>
    value !== null && value !== undefined && Number.isFinite(value);

/**
 * Writes a number out in Persian, e.g. 1250000 → «یک میلیون و دویست و پنجاه هزار».
 * A leading «یک هزار» is shortened to «هزار», as it is usually said.
 * Returns '' for null and non-finite values.
 */
export function numberToPersianWords(value: number | null | undefined) {
    if (!isConvertible(value)) return '';
    // Only at the start: in «صد و یک هزار» (101,000) the «یک» is needed.
    return persian.convert(value).replace(/^(منفی )?یک هزار/, '$1هزار');
}

/**
 * Writes a number out in English, e.g. 1250 → "one thousand two hundred fifty".
 * Returns '' for null and non-finite values.
 */
export function numberToEnglishWords(value: number | null | undefined) {
    if (!isConvertible(value)) return '';
    return english.convert(value).toLowerCase();
}

/**
 * Writes a number out in `language`, followed by an optional `unit`
 * (e.g. «هزار تومان», "one thousand dollars"). Returns '' when there is
 * nothing to write.
 */
export function numberToWords(
    value: number | null | undefined,
    { language = 'en', unit }: { language?: WordsLanguage; unit?: string } = {},
) {
    const words =
        language === 'fa'
            ? numberToPersianWords(value)
            : numberToEnglishWords(value);
    if (!words) return '';
    return unit ? `${words} ${unit}` : words;
}
