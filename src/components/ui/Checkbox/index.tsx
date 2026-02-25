import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { CheckIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/funcs/cn';
import { CheckboxProps } from './checkbox.props';
import { Label } from '../Label';

const checkboxVariants = cva(
    'border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 flex size-4 items-center justify-center rounded-[4px] border shadow-xs transition-shadow group-has-disabled/field:opacity-50 focus-visible:ring-3 peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            variant: {
                default:
                    'data-checked:bg-primary data-checked:text-primary-foreground data-checked:border-primary dark:data-checked:bg-primary aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:aria-checked:border-primary',
                secondary:
                    'data-checked:bg-secondary data-checked:text-secondary-foreground data-checked:border-secondary dark:data-checked:bg-secondary',
                success:
                    'data-checked:bg-green-600 data-checked:text-white data-checked:border-green-600 dark:data-checked:bg-green-500 dark:data-checked:border-green-500',
                info: 'data-checked:bg-blue-600 data-checked:text-white data-checked:border-blue-600 dark:data-checked:bg-blue-500 dark:data-checked:border-blue-500',
                warning:
                    'data-checked:bg-amber-500 data-checked:text-white data-checked:border-amber-500 dark:data-checked:bg-amber-400 dark:data-checked:border-amber-400',
                destructive:
                    'data-checked:bg-destructive data-checked:text-destructive-foreground data-checked:border-destructive dark:data-checked:bg-destructive aria-invalid:border-destructive aria-invalid:ring-destructive/20',
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
    ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> &
    CheckboxProps &
    VariantProps<typeof checkboxVariants>) {
    return (
        <div className='flex items-center gap-3'>
            <CheckboxPrimitive.Root
                data-slot='checkbox'
                className={cn(checkboxVariants({ variant }), className)}
                id={id}
                {...props}
            >
                <CheckboxPrimitive.Indicator
                    data-slot='checkbox-indicator'
                    className='[&>svg]:size-3.5 grid place-content-center text-current transition-none'
                >
                    <CheckIcon />
                </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
            {label && <Label htmlFor={id}>{label}</Label>}
        </div>
    );
}

export { Checkbox, checkboxVariants };

