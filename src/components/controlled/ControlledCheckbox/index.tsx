'use client';

import CheckboxWrapper from '@/components/ui/Checkbox';
import { type CheckboxWrapperProps } from '@/components/ui/Checkbox/Checkbox.types';
import Field, { FieldError } from '@/components/ui/Field';
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from 'react-hook-form';

export type ControlledCheckboxProps<T extends FieldValues> = Omit<
    CheckboxWrapperProps,
    'name' | 'checked' | 'defaultChecked' | 'onCheckedChange'
> & {
    name: Path<T>;
    control: Control<T>;
    error?: string;
    onValueChange?: (checked: boolean) => void;
};

// Stores a boolean; "indeterminate" never reaches the form.
export const ControlledCheckbox = <T extends FieldValues>({
    name,
    control,
    onValueChange,
    error,
    ...props
}: ControlledCheckboxProps<T>) => (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
            const message = error ?? fieldState.error?.message;
            return (
                <Field
                    data-invalid={!!message || undefined}
                    className="relative pb-1"
                >
                    <CheckboxWrapper
                        {...props}
                        name={field.name}
                        checked={field.value === true}
                        onCheckedChange={(checked) => {
                            const next = checked === true;
                            field.onChange(next);
                            onValueChange?.(next);
                        }}
                    />
                    {message && <FieldError>{message}</FieldError>}
                </Field>
            );
        }}
    />
);
