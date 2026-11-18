'use client';

import TimePicker from '@/components/ui/TimePicker';
import { type TimePickerProps } from '@/components/ui/TimePicker/TimePicker.types';
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from 'react-hook-form';

export type ControlledTimePickerProps<T extends FieldValues> = Omit<
    TimePickerProps,
    'value' | 'onChange'
> & {
    name: Path<T>;
    control: Control<T>;
    onValueChange?: (value: string | undefined) => void;
};

export const ControlledTimePicker = <T extends FieldValues>({
    name,
    control,
    onValueChange,
    error,
    ...props
}: ControlledTimePickerProps<T>) => (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
            <TimePicker
                {...props}
                value={field.value}
                onChange={(val) => {
                    field.onChange(val);
                    onValueChange?.(val);
                }}
                error={error ?? fieldState.error?.message}
            />
        )}
    />
);
