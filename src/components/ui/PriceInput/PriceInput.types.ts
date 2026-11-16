import type { NumberInputProps } from '@/components/ui/NumberInput/NumberInput.types';
import type { WordsLanguage } from '@/utils/funcs/numberToWords';
import type { ReactNode } from 'react';

export type PriceInputProps = NumberInputProps & {
    /** Currency symbol, code or unit, e.g. `$`, `EUR` or `Toman`. */
    currency?: ReactNode;
    /** Logical side the currency sits on; it replaces that side's addon. */
    currencyPosition?: 'start' | 'end';
    /**
     * Language of the amount written out in words under the input, or
     * `false` to hide it. While shown, it takes the place of `hint`.
     */
    words?: WordsLanguage | false;
    /** Unit written after the words, e.g. `تومان` → «هزار تومان». */
    wordsUnit?: string;
};
