'use client';

import SelectWrapper from '@/components/ui/Select';
import { type SelectWrapperProps } from '@/components/ui/Select/Select.types';
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from 'react-hook-form';

export type ControlledSelectProps<T extends FieldValues> = Omit<
    SelectWrapperProps,
    'value' | 'onValueChange'
> & {
    name: Path<T>;
    control: Control<T>;
    onValueChange?: (value: string) => void;
};

export const ControlledSelect = <T extends FieldValues>({
    name,
    control,
    onValueChange,
    error,
    ...props
}: ControlledSelectProps<T>) => (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
            <SelectWrapper
                {...props}
                value={field.value ?? ''}
                onValueChange={(val) => {
                    field.onChange(val);
                    onValueChange?.(val);
                }}
                error={error ?? fieldState.error?.message}
            />
        )}
    />
);
