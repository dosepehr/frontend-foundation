'use client';
import { Switch as SwitchPrimitive } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/funcs/cn';
import { Label } from '../Label';
import { SwitchProps } from './switch.type';


const switchVariants = cva(
    [
        'data-unchecked:bg-input dark:data-unchecked:bg-input/80',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:ring-3',
        'shrink-0 rounded-full border border-transparent shadow-xs',
        'data-[size=default]:h-[18.4px] data-[size=default]:w-[32px]',
        'data-[size=sm]:h-[14px] data-[size=sm]:w-[24px]',
        'peer group/switch relative inline-flex items-center transition-all outline-none',
        'after:absolute after:-inset-x-3 after:-inset-y-2',
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
    ],
    {
        variants: {
            variant: {
                default: 'data-checked:bg-primary',
                secondary: 'data-checked:bg-secondary',
                success:
                    'data-checked:bg-green-600 dark:data-checked:bg-green-500',
                info: 'data-checked:bg-blue-600 dark:data-checked:bg-blue-500',
                warning:
                    'data-checked:bg-amber-500 dark:data-checked:bg-amber-400',
                destructive:
                    'data-checked:bg-destructive dark:data-checked:bg-destructive',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);


const switchThumbVariants = cva(
    [
        'bg-background',
        'dark:data-unchecked:bg-foreground',
        'rounded-full pointer-events-none block ring-0 transition-transform',
        'group-data-[size=default]/switch:size-4',
        'group-data-[size=sm]/switch:size-3',
        'group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)]',
        'group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)]',
        'group-data-[size=default]/switch:data-unchecked:translate-x-0',
        'group-data-[size=sm]/switch:data-unchecked:translate-x-0',
    ],
    {
        variants: {
            variant: {
                default: 'dark:data-checked:bg-primary-foreground',
                secondary: 'dark:data-checked:bg-secondary-foreground',
                success: 'data-checked:bg-white',
                info: 'data-checked:bg-white',
                warning: 'data-checked:bg-white',
                destructive: 'data-checked:bg-destructive-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);




function Switch({
    className,
    size = 'default',
    variant,
    label,
    id,
    ...props
}: SwitchProps) {
    return (
        <div className='flex items-center gap-3'>
            <SwitchPrimitive.Root
                data-slot='switch'
                data-size={size}
                id={id}
                className={cn(switchVariants({ variant }), className)}
                {...props}
            >
                <SwitchPrimitive.Thumb
                    data-slot='switch-thumb'
                    className={cn(switchThumbVariants({ variant }))}
                />
            </SwitchPrimitive.Root>

            {label && <Label htmlFor={id}>{label}</Label>}
        </div>
    );
}

export { Switch, switchVariants };

