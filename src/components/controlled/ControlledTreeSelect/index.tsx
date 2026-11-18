'use client';

import TreeSelect from '@/components/ui/TreeSelect';
import { type TreeSelectProps } from '@/components/ui/TreeSelect/TreeSelect.types';
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from 'react-hook-form';

const NO_VALUES: string[] = [];

export type ControlledTreeSelectProps<T extends FieldValues> = Omit<
    TreeSelectProps,
    'selected' | 'onChange'
> & {
    name: Path<T>;
    control: Control<T>;
    onValueChange?: (values: string[]) => void;
};

export const ControlledTreeSelect = <T extends FieldValues>({
    name,
    control,
    onValueChange,
    error,
    ...props
}: ControlledTreeSelectProps<T>) => (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
            <TreeSelect
                {...props}
                selected={field.value ?? NO_VALUES}
                onChange={(values) => {
                    field.onChange(values);
                    onValueChange?.(values);
                }}
                error={error ?? fieldState.error?.message}
            />
        )}
    />
);
