import { cn } from '@/utils/funcs/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const alertVariants = cva(
    "group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-start text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pe-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default: 'bg-card text-card-foreground',
                // Status variants use the theme tokens, so they follow dark mode
                // and custom themes instead of fixed palette colors.
                destructive:
                    'border-destructive/30 bg-destructive/10 text-destructive-text *:data-[slot=alert-description]:text-destructive-text/90 *:[svg]:text-current',
                info: 'border-info/30 bg-info/10 text-info-text *:data-[slot=alert-description]:text-info-text/90 *:[svg]:text-info',
                success:
                    'border-success/30 bg-success/10 text-success-text *:data-[slot=alert-description]:text-success-text/90 *:[svg]:text-success',
                warning:
                    'border-warning/30 bg-warning/10 text-warning-text *:data-[slot=alert-description]:text-warning-text/90 *:[svg]:text-warning-text',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

const Alert = ({
    className,
    variant,
    ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) => {
    return (
        <div
            data-slot="alert"
            role="alert"
            className={cn(alertVariants({ variant }), className)}
            {...props}
        />
    );
};

const AlertTitle = ({ className, ...props }: React.ComponentProps<'div'>) => {
    return (
        <div
            data-slot="alert-title"
            className={cn(
                'font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground',
                className,
            )}
            {...props}
        />
    );
};

const AlertDescription = ({
    className,
    ...props
}: React.ComponentProps<'div'>) => {
    return (
        <div
            data-slot="alert-description"
            className={cn(
                'text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4',
                className,
            )}
            {...props}
        />
    );
};

const AlertAction = ({ className, ...props }: React.ComponentProps<'div'>) => {
    return (
        <div
            data-slot="alert-action"
            className={cn('absolute end-2 top-2', className)}
            {...props}
        />
    );
};

export { Alert, AlertAction, AlertDescription, AlertTitle, alertVariants };
export type { VariantProps };
