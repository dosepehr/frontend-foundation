'use client';

import Rating from '@/components/ui/Rating';
import { type RatingProps } from '@/components/ui/Rating/Rating.types';
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from 'react-hook-form';

export type ControlledRatingProps<T extends FieldValues> = Omit<
    RatingProps,
    'name' | 'value' | 'defaultValue' | 'onValueChange'
> & {
    name: Path<T>;
    control: Control<T>;
    onValueChange?: (value: number) => void;
};

export const ControlledRating = <T extends FieldValues>({
    name,
    control,
    onValueChange,
    error,
    ...props
}: ControlledRatingProps<T>) => (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
            <Rating
                {...props}
                name={field.name}
                value={field.value ?? 0}
                onValueChange={(val) => {
                    field.onChange(val);
                    onValueChange?.(val);
                }}
                error={error ?? fieldState.error?.message}
            />
        )}
    />
);
