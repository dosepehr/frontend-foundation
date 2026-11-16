/* c8 ignore start */
'use client';
/* c8 ignore stop */

import NumberInput from '@/components/ui/NumberInput';
import { numberToWords } from '@/utils/funcs/numberToWords';
import type { PriceInputProps } from './PriceInput.types';

const PriceInput = ({
    currency,
    currencyPosition = 'start',
    startAddon,
    endAddon,
    thousandSeparator = ',',
    decimalScale = 2,
    min = 0,
    showStepper = false,
    words = 'fa',
    wordsUnit,
    hint,
    ...props
}: PriceInputProps) => {
    const hasCurrency = currency !== undefined && currency !== null;

    return (
        <NumberInput
            {...props}
            thousandSeparator={thousandSeparator}
            decimalScale={decimalScale}
            min={min}
            showStepper={showStepper}
            startAddon={
                hasCurrency && currencyPosition === 'start'
                    ? currency
                    : startAddon
            }
            endAddon={
                hasCurrency && currencyPosition === 'end' ? currency : endAddon
            }
            hint={
                words
                    ? (value) =>
                          numberToWords(value, {
                              language: words,
                              unit: wordsUnit,
                          })
                    : hint
            }
        />
    );
};

export default PriceInput;
