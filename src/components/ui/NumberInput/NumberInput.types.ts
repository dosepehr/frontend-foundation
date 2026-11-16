import type { InputProps } from '@/components/ui/Input/Input.types';
import type { UseNumberInputOptions } from '@/hooks/useNumberInput';
import type { ReactNode } from 'react';

export type NumberInputProps = Omit<
    InputProps,
    | 'type'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'min'
    | 'max'
    | 'step'
    | 'ref'
    | 'hint'
> &
    Omit<
        UseNumberInputOptions,
        'disabled' | 'readOnly' | 'onBlur' | 'onKeyDown'
    > & {
        /** Shows increment/decrement buttons at the end of the input. */
        showStepper?: boolean;
        /** Shown under the input; a function receives the current value. */
        hint?: ReactNode | ((value: number | null) => ReactNode);
    };

export type NumberInputStepperProps = {
    onIncrement: () => void;
    onDecrement: () => void;
    canIncrement: boolean;
    canDecrement: boolean;
};
