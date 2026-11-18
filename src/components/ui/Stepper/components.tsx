/* c8 ignore start */
'use client';
/* c8 ignore stop */

import { cn } from '@/utils/funcs/cn';
import { cva } from 'class-variance-authority';
import { AlertCircleIcon, CheckIcon } from 'lucide-react';
import type {
    StepperIndicatorProps,
    StepperItemProps,
    StepperOrientation,
} from './Stepper.types';

const indicatorVariants = cva(
    'flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
    {
        variants: {
            status: {
                complete: 'border-primary bg-primary text-primary-foreground',
                current: 'border-primary bg-background text-primary-text',
                upcoming: 'border-border bg-background text-muted-foreground',
                error: 'border-destructive bg-destructive/10 text-destructive-text',
            },
        },
    },
);

const titleVariants = cva('text-sm leading-tight', {
    variants: {
        status: {
            complete: 'text-foreground',
            current: 'font-medium text-foreground',
            upcoming: 'text-muted-foreground',
            error: 'font-medium text-destructive-text',
        },
    },
});

export const StepperIndicator = ({
    index,
    status,
    icon,
}: StepperIndicatorProps) => (
    <span
        data-slot="stepper-indicator"
        aria-hidden
        className={indicatorVariants({ status })}
    >
        {status === 'complete' && <CheckIcon className="size-4" />}
        {status === 'error' && <AlertCircleIcon className="size-4" />}
        {(status === 'current' || status === 'upcoming') && (icon ?? index + 1)}
    </span>
);

export const StepperSeparator = ({
    complete,
    orientation,
}: {
    complete: boolean;
    orientation: StepperOrientation;
}) => (
    <span
        data-slot="stepper-separator"
        aria-hidden
        className={cn(
            'transition-colors',
            complete ? 'bg-primary' : 'bg-border',
            orientation === 'horizontal'
                ? 'h-0.5 min-w-4 flex-1 rounded-full'
                : // Centered under the size-8 indicator; logical so RTL works.
                  'absolute start-[15px] top-10 bottom-2 w-0.5 rounded-full',
        )}
    />
);

export const StepperItem = ({
    step,
    index,
    status,
    clickable,
    isLast,
    orientation,
    onClick,
    optionalLabel = 'Optional',
    completeLabel = 'Completed',
    errorLabel = 'Error',
}: StepperItemProps) => {
    const horizontal = orientation === 'horizontal';
    const statusLabel =
        status === 'complete'
            ? completeLabel
            : status === 'error'
              ? errorLabel
              : undefined;

    const content = (
        <>
            <StepperIndicator index={index} status={status} icon={step.icon} />
            <span className="grid gap-0.5 text-start">
                <span
                    data-slot="stepper-title"
                    className={titleVariants({ status })}
                >
                    {step.title}
                    {statusLabel && (
                        <span className="sr-only"> ({statusLabel})</span>
                    )}
                </span>
                {step.optional && (
                    <span className="text-xs text-muted-foreground">
                        {optionalLabel}
                    </span>
                )}
                {step.description && (
                    <span
                        className={cn(
                            'text-xs text-muted-foreground',
                            horizontal && 'max-sm:hidden',
                        )}
                    >
                        {step.description}
                    </span>
                )}
            </span>
        </>
    );

    const triggerClass = cn(
        'flex shrink-0 items-start gap-2 rounded-md outline-none',
        horizontal ? 'items-center' : 'gap-3',
        // Dashed instead of faded, so the label keeps its contrast.
        step.disabled && '[&_[data-slot=stepper-indicator]]:border-dashed',
    );

    return (
        <li
            data-slot="stepper-item"
            data-status={status}
            aria-current={status === 'current' ? 'step' : undefined}
            data-disabled={step.disabled || undefined}
            className={cn(
                horizontal
                    ? 'flex flex-1 items-center gap-2 last:flex-none'
                    : 'relative pb-8 last:pb-0',
            )}
        >
            {clickable ? (
                <button
                    type="button"
                    onClick={onClick}
                    className={cn(
                        triggerClass,
                        'cursor-pointer focus-visible:ring-3 focus-visible:ring-primary/50',
                        '[&:hover_[data-slot=stepper-title]]:text-primary-text',
                    )}
                >
                    {content}
                </button>
            ) : (
                <div className={triggerClass}>{content}</div>
            )}
            {!isLast && (
                <StepperSeparator
                    complete={status === 'complete'}
                    orientation={orientation}
                />
            )}
        </li>
    );
};
