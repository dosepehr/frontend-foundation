'use client';

import Asterisk from '@/components/ui/Asterisk';
import {
    FieldDescription,
    FieldError,
    FieldLegend,
    FieldSet,
} from '@/components/ui/Field';
import RadioGroupWrapper from '@/components/ui/RadioGroup';
import { type RadioGroupWrapperProps } from '@/components/ui/RadioGroup/RadioGroup.types';
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from 'react-hook-form';

export type ControlledRadioGroupProps<T extends FieldValues> = Omit<
    RadioGroupWrapperProps,
    'name' | 'value' | 'defaultValue' | 'onValueChange' | 'required'
> & {
    name: Path<T>;
    control: Control<T>;
    /** Legend of the group. */
    label?: string;
    description?: string;
    error?: string;
    /** Marks the legend, not each option, as required. */
    required?: boolean;
    onValueChange?: (value: string) => void;
};

export const ControlledRadioGroup = <T extends FieldValues>({
    name,
    control,
    label,
    description,
    required,
    onValueChange,
    error,
    ...props
}: ControlledRadioGroupProps<T>) => (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
            const message = error ?? fieldState.error?.message;
            return (
                <FieldSet
                    data-invalid={!!message || undefined}
                    className="relative pb-1"
                >
                    {label && (
                        <FieldLegend
                            variant="label"
                            className="flex items-center gap-1"
                        >
                            {label}
                            {required && <Asterisk />}
                        </FieldLegend>
                    )}
                    {description && (
                        <FieldDescription>{description}</FieldDescription>
                    )}
                    <RadioGroupWrapper
                        {...props}
                        name={field.name}
                        value={field.value ?? ''}
                        onValueChange={(val) => {
                            field.onChange(val);
                            onValueChange?.(val);
                        }}
                        aria-invalid={!!message || undefined}
                    />
                    {message && <FieldError>{message}</FieldError>}
                </FieldSet>
            );
        }}
    />
);
