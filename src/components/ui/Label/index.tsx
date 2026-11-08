/* c8 ignore start */
'use client';
/* c8 ignore stop */

import Asterisk from '@/components/ui/Asterisk';
import { cn } from '@/utils/funcs/cn';
import { Label as LabelPrimitive } from 'radix-ui';
import type { LabelProps } from './Label.types';

const Label = ({
    className,
    disabled,
    required,
    children,
    ...props
}: LabelProps) => {
    return (
        <LabelPrimitive.Root
            data-slot="label"
            aria-disabled={disabled || undefined}
            className={cn(
                'xs:text-sm relative flex w-fit items-center gap-2 text-xs leading-none font-medium select-none',
                disabled && 'cursor-not-allowed opacity-50',
                className,
            )}
            {...props}
        >
            {children}
            {required && <Asterisk />}
        </LabelPrimitive.Root>
    );
};

export default Label;
