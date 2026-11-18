'use client';

import MobileInput from '@/components/ui/MobileInput';
import { type MobileInputProps } from '@/components/ui/MobileInput/MobileInput.types';
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from 'react-hook-form';

export type ControlledMobileInputProps<T extends FieldValues> = Omit<
    MobileInputProps,
    'name' | 'value' | 'defaultValue' | 'onValueChange'
> & {
    name: Path<T>;
    control: Control<T>;
    /** Called with the number normalized as `09xxxxxxxxx`. */
    onValueChange?: (value: string) => void;
};

export const ControlledMobileInput = <T extends FieldValues>({
    name,
    control,
    onValueChange,
    onBlur,
    error,
    ...props
}: ControlledMobileInputProps<T>) => (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
            <MobileInput
                {...props}
                ref={field.ref}
                name={field.name}
                value={field.value ?? ''}
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
