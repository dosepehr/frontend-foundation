/* c8 ignore start */
'use client';
/* c8 ignore stop */

import Input from '@/components/ui/Input';
import { NumberInputStepper } from './components';
import { useNumberInput } from './hooks/useNumberInput/useNumberInput';
import type { NumberInputProps } from './NumberInput.types';

const NumberInput = ({
    value,
    defaultValue,
    onValueChange,
    min,
    max,
    step,
    thousandSeparator,
    decimalScale,
    fixedDecimalScale,
    allowNegative,
    showStepper = true,
    hint,
    endAddon,
    name,
    error,
    disabled,
    readOnly,
    ref,
    onBlur,
    onKeyDown,
    ...props
}: NumberInputProps) => {
    const {
        inputRef,
        value: current,
        inputValue,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        onBlur: handleBlur,
        increment,
        decrement,
        canIncrement,
        canDecrement,
    } = useNumberInput({
        value,
        defaultValue,
        onValueChange,
        min,
        max,
        step,
        thousandSeparator,
        decimalScale,
        fixedDecimalScale,
        allowNegative,
        disabled,
        readOnly,
        ref,
        onBlur,
        onKeyDown,
    });

    const stepper = showStepper && (
        <NumberInputStepper
            onIncrement={increment}
            onDecrement={decrement}
            canIncrement={canIncrement}
            canDecrement={canDecrement}
        />
    );

    return (
        <>
            <Input
                {...props}
                ref={inputRef}
                type="text"
                role="spinbutton"
                inputMode={decimalScale === 0 ? 'numeric' : 'decimal'}
                autoComplete="off"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                hint={typeof hint === 'function' ? hint(current) : hint}
                error={error}
                disabled={disabled}
                readOnly={readOnly}
                aria-invalid={!!error || undefined}
                aria-valuenow={current ?? undefined}
                aria-valuemin={min}
                aria-valuemax={max}
                endAddon={
                    endAddon && stepper ? (
                        <span className="flex items-center gap-2">
                            {endAddon}
                            {stepper}
                        </span>
                    ) : (
                        endAddon || stepper || undefined
                    )
                }
            />
            {/* The visible text holds separators, so forms submit the raw number. */}
            {name && (
                <input
                    type="hidden"
                    name={name}
                    value={current ?? ''}
                    disabled={disabled}
                />
            )}
        </>
    );
};

export default NumberInput;
