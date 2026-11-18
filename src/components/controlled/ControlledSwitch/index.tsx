'use client';

import Field, { FieldError } from '@/components/ui/Field';
import SwitchWrapper from '@/components/ui/Switch';
import { type SwitchWrapperProps } from '@/components/ui/Switch/Switch.types';
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from 'react-hook-form';

export type ControlledSwitchProps<T extends FieldValues> = Omit<
    SwitchWrapperProps,
    'name' | 'checked' | 'defaultChecked' | 'onCheckedChange'
> & {
    name: Path<T>;
    control: Control<T>;
    error?: string;
    onValueChange?: (checked: boolean) => void;
};

export const ControlledSwitch = <T extends FieldValues>({
    name,
    control,
    onValueChange,
    error,
    ...props
}: ControlledSwitchProps<T>) => (
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
                    <SwitchWrapper
                        {...props}
                        name={field.name}
                        checked={field.value === true}
                        onCheckedChange={(checked) => {
                            field.onChange(checked);
                            onValueChange?.(checked);
                        }}
                    />
                    {message && <FieldError>{message}</FieldError>}
                </Field>
            );
        }}
    />
);
