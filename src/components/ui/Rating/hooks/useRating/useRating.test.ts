import { act, renderHook } from '@testing-library/react';
import type { KeyboardEvent, MouseEvent } from 'react';
import {
    ratingAt,
    starFill,
    useRating,
    type UseRatingOptions,
} from './useRating';

function element(direction: 'ltr' | 'rtl' = 'ltr') {
    const node = document.createElement('span');
    node.style.direction = direction;
    document.body.append(node);
    node.getBoundingClientRect = () => ({ left: 100, width: 20 }) as DOMRect;
    return node;
}

const pointer = (clientX: number, direction?: 'ltr' | 'rtl') =>
    ({
        clientX,
        currentTarget: element(direction),
    }) as unknown as MouseEvent<HTMLElement> & React.PointerEvent<HTMLElement>;

function key(name: string, direction?: 'ltr' | 'rtl') {
    return {
        key: name,
        currentTarget: element(direction),
        preventDefault: vi.fn(),
    } as unknown as KeyboardEvent<HTMLElement>;
}

const setup = (options: UseRatingOptions = {}) =>
    renderHook(() => useRating(options));

describe('ratingAt and starFill', () => {
    it('picks whole stars without halves', () => {
        expect(ratingAt(2, 0.2, false)).toBe(3);
        expect(ratingAt(2, 0.9, false)).toBe(3);
    });

    it('picks the half on the first half of a star', () => {
        expect(ratingAt(2, 0.3, true)).toBe(2.5);
        expect(ratingAt(2, 0.7, true)).toBe(3);
    });

    it('fills stars up to the value', () => {
        expect(starFill(0, 3.5)).toBe(1);
        expect(starFill(3, 3.5)).toBe(0.5);
        expect(starFill(4, 3.5)).toBe(0);
        expect(starFill(2, 2.25)).toBe(0.25);
    });
});

describe('useRating', () => {
    it('starts at the default value', () => {
        const { result } = setup({ defaultValue: 2 });
        expect(result.current.value).toBe(2);
        expect(result.current.displayValue).toBe(2);
    });

    it('selects the clicked star', () => {
        const onValueChange = vi.fn();
        const { result } = setup({ onValueChange });

        act(() => result.current.onStarClick(pointer(115), 3));

        expect(result.current.value).toBe(4);
        expect(onValueChange).toHaveBeenCalledWith(4);
    });

    it('selects half stars, mirrored in RTL', () => {
        const { result } = setup({ allowHalf: true });

        act(() => result.current.onStarClick(pointer(104), 1));
        expect(result.current.value).toBe(1.5);

        // In RTL the start of the star is on its right.
        act(() => result.current.onStarClick(pointer(104, 'rtl'), 1));
        expect(result.current.value).toBe(2);
    });

    it('clears when the current value is clicked again', () => {
        const { result } = setup({ defaultValue: 4 });

        act(() => result.current.onStarClick(pointer(115), 3));

        expect(result.current.value).toBe(0);
    });

    it('keeps the value when clearing is not allowed', () => {
        const { result } = setup({ defaultValue: 4, allowClear: false });

        act(() => result.current.onStarClick(pointer(115), 3));

        expect(result.current.value).toBe(4);
    });

    it('previews the hovered value until the pointer leaves', () => {
        const { result } = setup({ defaultValue: 1 });

        act(() => result.current.onStarPointerMove(pointer(110), 4));
        expect(result.current.displayValue).toBe(5);
        expect(result.current.value).toBe(1);

        act(() => result.current.onPointerLeave());
        expect(result.current.displayValue).toBe(1);
    });

    it('steps with the arrow keys and jumps with Home and End', () => {
        const { result } = setup({ defaultValue: 2, allowHalf: true });

        act(() => result.current.onKeyDown(key('ArrowRight')));
        expect(result.current.value).toBe(2.5);
        act(() => result.current.onKeyDown(key('ArrowDown')));
        act(() => result.current.onKeyDown(key('ArrowDown')));
        expect(result.current.value).toBe(1.5);
        act(() => result.current.onKeyDown(key('End')));
        expect(result.current.value).toBe(5);
        act(() => result.current.onKeyDown(key('ArrowUp')));
        expect(result.current.value).toBe(5);
        act(() => result.current.onKeyDown(key('Home')));
        expect(result.current.value).toBe(0);
        act(() => result.current.onKeyDown(key('ArrowLeft')));
        expect(result.current.value).toBe(0);
    });

    it('swaps left and right in RTL', () => {
        const { result } = setup({ defaultValue: 2 });

        act(() => result.current.onKeyDown(key('ArrowLeft', 'rtl')));
        expect(result.current.value).toBe(3);
        act(() => result.current.onKeyDown(key('ArrowRight', 'rtl')));
        expect(result.current.value).toBe(2);
    });

    it('ignores other keys', () => {
        const { result } = setup({ defaultValue: 2 });
        const event = key('a');

        act(() => result.current.onKeyDown(event));

        expect(result.current.value).toBe(2);
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('does nothing when read-only or disabled', () => {
        for (const options of [{ readOnly: true }, { disabled: true }]) {
            const { result } = setup({ defaultValue: 2, ...options });
            expect(result.current.isInteractive).toBe(false);

            act(() => result.current.onStarClick(pointer(115), 4));
            act(() => result.current.onStarPointerMove(pointer(115), 4));
            act(() => result.current.onKeyDown(key('ArrowRight')));

            expect(result.current.value).toBe(2);
            expect(result.current.displayValue).toBe(2);
        }
    });

    it('counts a star without width as fully pointed', () => {
        const { result } = setup({ allowHalf: true });
        const event = pointer(0);
        event.currentTarget.getBoundingClientRect = () =>
            ({ left: 0, width: 0 }) as DOMRect;

        act(() => result.current.onStarClick(event, 0));

        expect(result.current.value).toBe(1);
    });
});
