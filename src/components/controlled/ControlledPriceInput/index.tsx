'use client';

import PriceInput from '@/components/ui/PriceInput';
import { type PriceInputProps } from '@/components/ui/PriceInput/PriceInput.types';
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from 'react-hook-form';

export type ControlledPriceInputProps<T extends FieldValues> = Omit<
    PriceInputProps,
    'name' | 'value' | 'defaultValue' | 'onValueChange'
> & {
    name: Path<T>;
    control: Control<T>;
    onValueChange?: (value: number | null) => void;
};

export const ControlledPriceInput = <T extends FieldValues>({
    name,
    control,
    onValueChange,
    onBlur,
    error,
    ...props
}: ControlledPriceInputProps<T>) => (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
            <PriceInput
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
