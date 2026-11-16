/* c8 ignore start */
'use client';
/* c8 ignore stop */

import { ChevronDown, ChevronUp } from 'lucide-react';
import type { NumberInputStepperProps } from './NumberInput.types';

const stepButtonClass =
    'flex h-4 w-5 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:enabled:bg-accent hover:enabled:text-foreground disabled:opacity-40';

const NumberInputStepper = ({
    onIncrement,
    onDecrement,
    canIncrement,
    canDecrement,
}: NumberInputStepperProps) => {
    return (
        <div data-slot="number-input-stepper" className="flex flex-col">
            <button
                type="button"
                tabIndex={-1}
                aria-label="Increment"
                disabled={!canIncrement}
                onClick={onIncrement}
                className={stepButtonClass}
            >
                <ChevronUp className="size-3.5" />
            </button>
            <button
                type="button"
                tabIndex={-1}
                aria-label="Decrement"
                disabled={!canDecrement}
                onClick={onDecrement}
                className={stepButtonClass}
            >
                <ChevronDown className="size-3.5" />
            </button>
        </div>
    );
};

export { NumberInputStepper };
