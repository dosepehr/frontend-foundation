import { clampStep, getStepStatus, isStepClickable } from './stepper';

const step = { title: 'Step' };

describe('getStepStatus', () => {
    it('marks steps before, at and after the active one', () => {
        expect(getStepStatus(step, 0, 1)).toBe('complete');
        expect(getStepStatus(step, 1, 1)).toBe('current');
        expect(getStepStatus(step, 2, 1)).toBe('upcoming');
    });

    it('lets an error override the position', () => {
        expect(getStepStatus({ ...step, error: true }, 0, 1)).toBe('error');
        expect(getStepStatus({ ...step, error: true }, 1, 1)).toBe('error');
    });
});

describe('isStepClickable', () => {
    it('allows only passed steps in a linear stepper', () => {
        expect(isStepClickable(step, 0, 1, true)).toBe(true);
        expect(isStepClickable(step, 2, 1, true)).toBe(false);
    });

    it('allows any other step in a non-linear stepper', () => {
        expect(isStepClickable(step, 2, 1, false)).toBe(true);
    });

    it('never allows the current or a disabled step', () => {
        expect(isStepClickable(step, 1, 1, false)).toBe(false);
        expect(isStepClickable({ ...step, disabled: true }, 0, 1, false)).toBe(
            false,
        );
    });
});

describe('clampStep', () => {
    it('keeps an index within the steps', () => {
        expect(clampStep(-1, 3)).toBe(0);
        expect(clampStep(5, 3)).toBe(2);
        expect(clampStep(1, 3)).toBe(1);
    });

    it('returns 0 when there are no steps', () => {
        expect(clampStep(2, 0)).toBe(0);
    });
});
