import type { ReactNode } from 'react';

export type StepperStatus = 'complete' | 'current' | 'upcoming' | 'error';

export type StepperOrientation = 'horizontal' | 'vertical';

export type StepperStep = {
    title: string;
    description?: string;
    /** Replaces the step number in the indicator. */
    icon?: ReactNode;
    /** Shows `optionalLabel` under the title. */
    optional?: boolean;
    /** Marks the step invalid, e.g. when its fields failed validation. */
    error?: boolean;
    disabled?: boolean;
};

export type StepperProps = {
    steps: StepperStep[];
    /** Index of the current step. */
    activeStep: number;
    /** Makes steps clickable; omit it for a display-only stepper. */
    onStepClick?: (index: number) => void;
    /** Only steps already passed can be clicked (default). */
    linear?: boolean;
    orientation?: StepperOrientation;
    optionalLabel?: string;
    /** Read by screen readers after a completed or invalid step's title. */
    completeLabel?: string;
    errorLabel?: string;
    'aria-label'?: string;
    className?: string;
};

export type StepperItemProps = {
    step: StepperStep;
    index: number;
    status: StepperStatus;
    clickable: boolean;
    isLast: boolean;
    orientation: StepperOrientation;
    onClick: () => void;
} & Pick<StepperProps, 'optionalLabel' | 'completeLabel' | 'errorLabel'>;

export type StepperIndicatorProps = {
    index: number;
    status: StepperStatus;
    icon?: ReactNode;
};
