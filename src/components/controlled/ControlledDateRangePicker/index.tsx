'use client';

import DateRangePicker from '@/components/ui/DateRangePicker';
import { type DateRangePickerProps } from '@/components/ui/DateRangePicker/DateRangePicker.types';
import type { DateRange } from 'react-day-picker';
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from 'react-hook-form';

export type ControlledDateRangePickerProps<T extends FieldValues> = Omit<
    DateRangePickerProps,
    'value' | 'onChange'
> & {
    name: Path<T>;
    control: Control<T>;
    onValueChange?: (range: DateRange | undefined) => void;
};

export const ControlledDateRangePicker = <T extends FieldValues>({
    name,
    control,
    onValueChange,
    error,
    ...props
}: ControlledDateRangePickerProps<T>) => (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
            <DateRangePicker
                {...props}
                value={field.value}
                onChange={(range) => {
                    field.onChange(range);
                    onValueChange?.(range);
                }}
                error={error ?? fieldState.error?.message}
            />
        )}
    />
);
