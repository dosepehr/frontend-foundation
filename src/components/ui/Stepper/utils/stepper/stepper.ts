import type { StepperStatus, StepperStep } from '../../Stepper.types';

/** Status of step `index` while `activeStep` is current. */
export function getStepStatus(
    step: StepperStep,
    index: number,
    activeStep: number,
): StepperStatus {
    if (step.error) return 'error';
    if (index < activeStep) return 'complete';
    if (index === activeStep) return 'current';
    return 'upcoming';
}

/**
 * Whether clicking step `index` should go to it: never the current or a
 * disabled step, and in a linear stepper only steps already passed.
 */
export function isStepClickable(
    step: StepperStep,
    index: number,
    activeStep: number,
    linear: boolean,
) {
    if (step.disabled || index === activeStep) return false;
    return !linear || index < activeStep;
}

/** Clamps a step index into `[0, count - 1]`. */
export function clampStep(index: number, count: number) {
    return Math.min(Math.max(index, 0), Math.max(count - 1, 0));
}
