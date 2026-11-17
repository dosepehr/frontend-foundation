'use client';

import { useControllableState } from '@/hooks/useControllableState';
import {
    useState,
    type KeyboardEvent,
    type MouseEvent,
    type PointerEvent,
} from 'react';

export type UseRatingOptions = {
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    /** Number of stars. */
    max?: number;
    /** Lets pointer and keyboard pick half stars. */
    allowHalf?: boolean;
    /** Clicking the current value again resets it to 0. */
    allowClear?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
};

const isRtl = (element: Element) =>
    getComputedStyle(element).direction === 'rtl';

/**
 * Value a pointer points at on star `index` (0-based), where `ratio` is how
 * far along the star it is in reading direction (0 = start, 1 = end).
 */
export function ratingAt(index: number, ratio: number, allowHalf: boolean) {
    return index + (allowHalf && ratio <= 0.5 ? 0.5 : 1);
}

/** Fill of star `index` for `value`: 0 (empty) to 1 (full). */
export function starFill(index: number, value: number) {
    return Math.min(Math.max(value - index, 0), 1);
}

/** State and handlers for a star rating with hover preview. */
export function useRating({
    value,
    defaultValue = 0,
    onValueChange,
    max = 5,
    allowHalf = false,
    allowClear = true,
    readOnly = false,
    disabled = false,
}: UseRatingOptions) {
    const [current, setCurrent] = useControllableState({
        value,
        defaultValue,
        onChange: onValueChange,
    });
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const isInteractive = !readOnly && !disabled;
    const step = allowHalf ? 0.5 : 1;

    const pointedValue = (event: MouseEvent<HTMLElement>, index: number) => {
        const target = event.currentTarget;
        const rect = target.getBoundingClientRect();
        const offset = rect.width
            ? (event.clientX - rect.left) / rect.width
            : 1;
        return ratingAt(index, isRtl(target) ? 1 - offset : offset, allowHalf);
    };

    const onStarPointerMove = (
        event: PointerEvent<HTMLElement>,
        index: number,
    ) => {
        if (isInteractive) setHoverValue(pointedValue(event, index));
    };

    const onStarClick = (event: MouseEvent<HTMLElement>, index: number) => {
        if (!isInteractive) return;
        const next = pointedValue(event, index);
        setCurrent(allowClear && next === current ? 0 : next);
    };

    const onPointerLeave = () => setHoverValue(null);

    const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (!isInteractive) return;
        const forward = isRtl(event.currentTarget) ? 'ArrowLeft' : 'ArrowRight';
        const backward = forward === 'ArrowLeft' ? 'ArrowRight' : 'ArrowLeft';
        const targets: Record<string, number> = {
            [forward]: current + step,
            ArrowUp: current + step,
            [backward]: current - step,
            ArrowDown: current - step,
            Home: 0,
            End: max,
        };
        if (!(event.key in targets)) return;
        event.preventDefault();
        setCurrent(Math.min(Math.max(targets[event.key], 0), max));
    };

    return {
        value: current,
        displayValue: hoverValue ?? current,
        isInteractive,
        onStarPointerMove,
        onStarClick,
        onPointerLeave,
        onKeyDown,
    };
}
