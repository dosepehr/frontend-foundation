import type { NumberFormatOptions } from '@/utils/funcs/numberFormat';
import type { ReactNode } from 'react';

/** `[from, to]`; `null` means that end is open. */
export type RangeValue = [number | null, number | null];

export type RangeInputProps = Pick<
    NumberFormatOptions,
    'thousandSeparator' | 'decimalScale'
> & {
    value?: RangeValue;
    defaultValue?: RangeValue;
    onValueChange?: (value: RangeValue) => void;
    min?: number;
    max?: number;
    step?: number;
    /** Shows a two-thumb slider under the inputs; needs `min` and `max`. */
    showSlider?: boolean;
    fromPlaceholder?: string;
    toPlaceholder?: string;
    /** Accessible names of the two inputs and slider thumbs. */
    fromLabel?: string;
    toLabel?: string;
    /** Addons shown in both inputs, e.g. a currency. */
    startAddon?: ReactNode;
    endAddon?: ReactNode;
    label?: string;
    description?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    id?: string;
    className?: string;
};
