'use client';

import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/src/utils/funcs/cn';
import { Label } from '../Label/components';
import type { CheckboxProps } from './checkbox.types';

export const checkboxVariants = cva(
    'peer border shadow-xs transition-shadow outline-none rounded-[4px] size-4 shrink-0 flex items-center justify-center focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            variant: {
                default:
                    'bg-background border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground',
                primary:
                    'bg-background border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-white',
                secondary:
                    'bg-background border-secondary data-[state=checked]:bg-secondary data-[state=checked]:border-secondary data-[state=checked]:text-secondary-foreground',
                success:
                    'bg-background border-success data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=checked]:text-white',
                warning:
                    'bg-background border-warning data-[state=checked]:bg-warning data-[state=checked]:border-warning data-[state=checked]:text-black',
                destructive:
                    'bg-background border-destructive data-[state=checked]:bg-destructive data-[state=checked]:border-destructive data-[state=checked]:text-white',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export const checkboxWrapperVariants = cva(
    'cursor-pointer flex items-start gap-2 px-3 py-2 rounded-md border transition-colors',
    {
        variants: {
            variant: {
                default:
                    'border-border hover:bg-accent has-[[aria-checked=true]]:border-input has-[[aria-checked=true]]:bg-accent',
                primary:
                    'border-border hover:bg-primary/10 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/10',
                secondary:
                    'border-border hover:bg-secondary/50 has-[[aria-checked=true]]:border-secondary has-[[aria-checked=true]]:bg-secondary/50',
                success:
                    'border-border hover:bg-success/10 has-[[aria-checked=true]]:border-success has-[[aria-checked=true]]:bg-success/10',
                warning:
                    'border-border hover:bg-warning/10 has-[[aria-checked=true]]:border-warning has-[[aria-checked=true]]:bg-warning/10',
                destructive:
                    'border-border hover:bg-destructive/10 has-[[aria-checked=true]]:border-destructive has-[[aria-checked=true]]:bg-destructive/10',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

function Checkbox({
    className,
    label,
    id,
    variant,
    required,
    ...props
}: CheckboxProps) {
    return (
        <Label
            className='flex items-center gap-2 w-fit font-normal'
            required={required}
        >
            <CheckboxPrimitive.Root
                data-slot='checkbox'
                id={id}
                className={cn(checkboxVariants({ variant }), className)}
                {...props}
            >
                <CheckboxPrimitive.Indicator
                    data-slot='checkbox-indicator'
                    className='grid place-content-center text-current transition-none'
                >
                    <CheckIcon className='size-3.5' />
                </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
            {label && <span className='text-sm leading-none'>{label}</span>}
        </Label>
    );
}

export { Checkbox };
export type { VariantProps };

