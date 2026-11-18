/* c8 ignore start */
'use client';
/* c8 ignore stop */

import { cn } from '@/utils/funcs/cn';
import { StepperItem } from './components';
import type { StepperProps } from './Stepper.types';
import { getStepStatus, isStepClickable } from './utils/stepper/stepper';

// Progress through a multi-step flow. Pair it with `useStepper` for the
// current step and gate "next" on the step's own validation.
const Stepper = ({
    steps,
    activeStep,
    onStepClick,
    linear = true,
    orientation = 'horizontal',
    optionalLabel,
    completeLabel,
    errorLabel,
    'aria-label': ariaLabel = 'Progress',
    className,
}: StepperProps) => (
    <ol
        data-slot="stepper"
        data-orientation={orientation}
        aria-label={ariaLabel}
        className={cn(
            orientation === 'horizontal'
                ? 'flex w-full items-center gap-2'
                : 'flex flex-col',
            className,
        )}
    >
        {steps.map((step, index) => (
            <StepperItem
                key={`${index}-${step.title}`}
                step={step}
                index={index}
                status={getStepStatus(step, index, activeStep)}
                clickable={
                    !!onStepClick &&
                    isStepClickable(step, index, activeStep, linear)
                }
                isLast={index === steps.length - 1}
                orientation={orientation}
                onClick={() => onStepClick?.(index)}
                optionalLabel={optionalLabel}
                completeLabel={completeLabel}
                errorLabel={errorLabel}
            />
        ))}
    </ol>
);

export default Stepper;
