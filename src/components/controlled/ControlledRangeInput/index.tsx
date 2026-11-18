'use client';

import RangeInput from '@/components/ui/RangeInput';
import {
    type RangeInputProps,
    type RangeValue,
} from '@/components/ui/RangeInput/RangeInput.types';
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from 'react-hook-form';

const EMPTY_RANGE: RangeValue = [null, null];

export type ControlledRangeInputProps<T extends FieldValues> = Omit<
    RangeInputProps,
    'value' | 'defaultValue' | 'onValueChange'
> & {
    name: Path<T>;
    control: Control<T>;
    onValueChange?: (value: RangeValue) => void;
};

export const ControlledRangeInput = <T extends FieldValues>({
    name,
    control,
    onValueChange,
    error,
    ...props
}: ControlledRangeInputProps<T>) => (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
            <RangeInput
                {...props}
                value={field.value ?? EMPTY_RANGE}
                onValueChange={(val) => {
                    field.onChange(val);
                    onValueChange?.(val);
                }}
                error={error ?? fieldState.error?.message}
            />
        )}
    />
);
