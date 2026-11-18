'use client';

import NumberInput from '@/components/ui/NumberInput';
import { type NumberInputProps } from '@/components/ui/NumberInput/NumberInput.types';
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from 'react-hook-form';

export type ControlledNumberInputProps<T extends FieldValues> = Omit<
    NumberInputProps,
    'name' | 'value' | 'defaultValue' | 'onValueChange'
> & {
    name: Path<T>;
    control: Control<T>;
    onValueChange?: (value: number | null) => void;
};

export const ControlledNumberInput = <T extends FieldValues>({
    name,
    control,
    onValueChange,
    onBlur,
    error,
    ...props
}: ControlledNumberInputProps<T>) => (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
            <NumberInput
                {...props}
                ref={field.ref}
                name={field.name}
                value={field.value ?? null}
                onValueChange={(val) => {
                    field.onChange(val);
                    onValueChange?.(val);
                }}
                onBlur={(event) => {
                    field.onBlur();
                    onBlur?.(event);
                }}
                error={error ?? fieldState.error?.message}
            />
        )}
    />
);
