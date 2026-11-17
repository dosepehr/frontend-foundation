/* c8 ignore start */
'use client';
/* c8 ignore stop */

import Field, {
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/Field';
import NumberInput from '@/components/ui/NumberInput';
import Slider from '@/components/ui/Slider';
import { useControllableState } from '@/hooks/useControllableState';
import { cn } from '@/utils/funcs/cn';
import { useId } from 'react';
import type { RangeInputProps, RangeValue } from './RangeInput.types';

const EMPTY_RANGE: RangeValue = [null, null];

const RangeInput = ({
    value,
    defaultValue = EMPTY_RANGE,
    onValueChange,
    min,
    max,
    step = 1,
    showSlider = false,
    fromPlaceholder = 'Min',
    toPlaceholder = 'Max',
    fromLabel = 'Minimum',
    toLabel = 'Maximum',
    startAddon,
    endAddon,
    thousandSeparator,
    decimalScale,
    label,
    description,
    error,
    required,
    disabled,
    id,
    className,
}: RangeInputProps) => {
    const generatedId = useId();
    const fromId = id ?? generatedId;
    const [[from, to], setRange] = useControllableState({
        value,
        defaultValue,
        onChange: onValueChange,
    });
    const hasSlider = showSlider && min !== undefined && max !== undefined;
    // Slider labels each thumb from an array of names.
    const thumbLabels = [fromLabel, toLabel];

    const shared = {
        step,
        thousandSeparator,
        decimalScale,
        startAddon,
        endAddon,
        disabled,
        invalid: !!error,
        showStepper: false,
    };

    return (
        <Field
            data-invalid={!!error || undefined}
            className={cn('relative pb-1', className)}
        >
            {label && (
                <FieldLabel
                    htmlFor={fromId}
                    required={required}
                    className="text-foreground"
                >
                    {label}
                </FieldLabel>
            )}
            {description && (
                <FieldDescription className="text-muted-foreground">
                    {description}
                </FieldDescription>
            )}
            <div data-slot="range-input" className="flex items-start gap-2">
                <NumberInput
                    {...shared}
                    id={fromId}
                    aria-label={fromLabel}
                    placeholder={fromPlaceholder}
                    min={min}
                    max={to ?? max}
                    value={from}
                    onValueChange={(next) => setRange([next, to])}
                />
                <span aria-hidden className="mt-2 text-muted-foreground">
                    –
                </span>
                <NumberInput
                    {...shared}
                    aria-label={toLabel}
                    placeholder={toPlaceholder}
                    min={from ?? min}
                    max={max}
                    value={to}
                    onValueChange={(next) => setRange([from, next])}
                />
            </div>
            {hasSlider && (
                <Slider
                    className="mt-1"
                    min={min}
                    max={max}
                    step={step}
                    disabled={disabled}
                    aria-label={thumbLabels}
                    value={[from ?? min, to ?? max]}
                    onValueChange={([nextFrom, nextTo]) =>
                        setRange([nextFrom, nextTo])
                    }
                />
            )}
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
};

export default RangeInput;
