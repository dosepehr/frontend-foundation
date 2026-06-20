/* c8 ignore start */
'use client';
/* c8 ignore stop */

import { cn } from '@/src/utils/funcs/cn';
import { Label as LabelPrimitive } from 'radix-ui';
import Asteriks from '../Asteriks';
import type { LabelProps } from './label.types';

function Label({
    className,
    disabled,
    required,
    children,
    ...props
}: LabelProps) {
    return (
        <LabelPrimitive.Root
            data-slot="label"
            className={cn(
                'xs:text-sm relative flex w-fit items-center gap-2 text-xs leading-none font-medium select-none',
                disabled && 'cursor-not-allowed opacity-50',
                className,
            )}
            {...props}
        >
            {children}
            {required && <Asteriks />}
        </LabelPrimitive.Root>
    );
}

export type { LabelProps } from './label.types';
export { Label };
