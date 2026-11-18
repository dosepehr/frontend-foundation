'use client';

import { useCallback, useState } from 'react';
import { clampStep } from '../../utils/stepper/stepper';

export type UseStepperOptions = {
    /** Number of steps. */
    count: number;
    initialStep?: number;
};

/**
 * Current step of a multi-step flow. Gate `next` yourself, e.g. on
 * `await trigger(stepFields)` from react-hook-form.
 */
export function useStepper({ count, initialStep = 0 }: UseStepperOptions) {
    const [activeStep, setActiveStep] = useState(() =>
        clampStep(initialStep, count),
    );

    const goTo = useCallback(
        (index: number) => setActiveStep(clampStep(index, count)),
        [count],
    );
    const next = useCallback(
        () => setActiveStep((step) => clampStep(step + 1, count)),
        [count],
    );
    const back = useCallback(
        () => setActiveStep((step) => clampStep(step - 1, count)),
        [count],
    );
    const reset = useCallback(
        () => setActiveStep(clampStep(initialStep, count)),
        [initialStep, count],
    );

    return {
        activeStep,
        isFirst: activeStep === 0,
        isLast: activeStep === count - 1,
        goTo,
        next,
        back,
        reset,
    };
}
