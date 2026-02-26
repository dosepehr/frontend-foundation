'use client';

import * as React from 'react';
import { Label as LabelPrimitive } from 'radix-ui';
import { cn } from '@/utils/funcs/cn';
import { LabelProps } from './label.type';
import Asteriks from './Asteriks';

function Label({
    className,
    children,
    required,
    disabled,
    ...props
}: LabelProps) {
    return (
        <LabelPrimitive.Root
            data-slot='label'
            className={cn(
                'gap-2 text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed relative w-fit!',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            {...props}
        >
            {children}
            {required && children && <Asteriks />}
        </LabelPrimitive.Root>
    );
}

export { Label };

