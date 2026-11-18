import { act, renderHook } from '@testing-library/react';
import { useStepper } from './useStepper';

describe('useStepper', () => {
    it('starts at the first step', () => {
        const { result } = renderHook(() => useStepper({ count: 3 }));
        expect(result.current.activeStep).toBe(0);
        expect(result.current.isFirst).toBe(true);
        expect(result.current.isLast).toBe(false);
    });

    it('starts at a clamped initial step', () => {
        const { result } = renderHook(() =>
            useStepper({ count: 3, initialStep: 9 }),
        );
        expect(result.current.activeStep).toBe(2);
        expect(result.current.isLast).toBe(true);
    });

    it('moves forward and back within the steps', () => {
        const { result } = renderHook(() => useStepper({ count: 2 }));

        act(() => result.current.back());
        expect(result.current.activeStep).toBe(0);

        act(() => result.current.next());
        act(() => result.current.next());
        expect(result.current.activeStep).toBe(1);

        act(() => result.current.back());
        expect(result.current.activeStep).toBe(0);
    });

    it('goes to a step and resets', () => {
        const { result } = renderHook(() =>
            useStepper({ count: 4, initialStep: 1 }),
        );

        act(() => result.current.goTo(3));
        expect(result.current.activeStep).toBe(3);

        act(() => result.current.goTo(-2));
        expect(result.current.activeStep).toBe(0);

        act(() => result.current.reset());
        expect(result.current.activeStep).toBe(1);
    });
});
