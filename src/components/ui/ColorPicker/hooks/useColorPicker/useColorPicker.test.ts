import { act, renderHook } from '@testing-library/react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { useColorPicker, type UseColorPickerOptions } from './useColorPicker';

const setup = (options: UseColorPickerOptions = {}) =>
    renderHook((props: UseColorPickerOptions) => useColorPicker(props), {
        initialProps: options,
    });

function pointer(clientX: number, clientY: number) {
    const target = document.createElement('div');
    target.getBoundingClientRect = () =>
        ({ left: 0, top: 0, width: 200, height: 100 }) as DOMRect;
    target.setPointerCapture = vi.fn();
    return {
        clientX,
        clientY,
        pointerId: 1,
        currentTarget: target,
    } as unknown as PointerEvent<HTMLElement>;
}

const key = (name: string, shiftKey = false) =>
    ({
        key: name,
        shiftKey,
        preventDefault: vi.fn(),
    }) as unknown as KeyboardEvent<HTMLElement>;

describe('useColorPicker — values', () => {
    it('defaults to black', () => {
        const { result } = setup();
        expect(result.current.hex).toBe('#000000');
        expect(result.current.rgb).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('normalizes the value', () => {
        const { result } = setup({ defaultValue: '#F00' });
        expect(result.current.hex).toBe('#ff0000');
        expect(result.current.hsv).toEqual({ h: 0, s: 100, v: 100 });
        expect(result.current.hexDraft).toBe('#ff0000');
    });

    it('falls back to black for an invalid value', () => {
        const { result } = setup({ value: 'nope' });
        expect(result.current.hex).toBe('#000000');
    });

    it('sets a color and reports it', () => {
        const onValueChange = vi.fn();
        const { result } = setup({ onValueChange });

        act(() => {
            expect(result.current.setColor('#00FF00')).toBe(true);
        });

        expect(result.current.hex).toBe('#00ff00');
        expect(onValueChange).toHaveBeenCalledWith('#00ff00');
    });

    it('rejects an invalid color', () => {
        const { result } = setup();
        act(() => {
            expect(result.current.setColor('blue')).toBe(false);
        });
        expect(result.current.hex).toBe('#000000');
    });

    it('sets one RGB channel', () => {
        const { result } = setup({ defaultValue: '#000000' });
        act(() => result.current.setRgb({ g: 128 }));
        expect(result.current.hex).toBe('#008000');
    });

    it('keeps the hue while the color is black', () => {
        const { result } = setup({ defaultValue: '#ff0000' });

        act(() => result.current.area.onKeyDown(key('ArrowDown', true)));
        for (let index = 0; index < 10; index += 1) {
            act(() => result.current.area.onKeyDown(key('ArrowDown', true)));
        }

        expect(result.current.hex).toBe('#000000');
        expect(result.current.hsv.h).toBe(0);
        act(() => result.current.setHue(240));
        expect(result.current.hsv.h).toBe(240);
    });

    it('follows a controlled value', () => {
        const { result, rerender } = setup({ value: '#ff0000' });
        rerender({ value: '#0000ff' });
        expect(result.current.hsv.h).toBe(240);
        expect(result.current.hexDraft).toBe('#0000ff');
    });
});

describe('useColorPicker — area and hue', () => {
    it('picks saturation and brightness from the pointer', () => {
        const { result } = setup({ defaultValue: '#ff0000' });

        act(() => result.current.area.onPointerDown(pointer(100, 25)));

        expect(result.current.hsv).toEqual({ h: 0, s: 50, v: 75 });
    });

    it('drags only while the pointer is down', () => {
        const { result } = setup({ defaultValue: '#ff0000' });

        act(() => result.current.area.onPointerMove(pointer(0, 0)));
        expect(result.current.hsv.s).toBe(100);

        act(() => result.current.area.onPointerDown(pointer(200, 0)));
        act(() => result.current.area.onPointerMove(pointer(400, 200)));
        expect(result.current.hsv).toEqual({ h: 0, s: 100, v: 0 });

        act(() => result.current.area.onPointerUp());
        act(() => result.current.area.onPointerMove(pointer(0, 0)));
        expect(result.current.hsv.s).toBe(100);
    });

    it('moves with the arrow keys, ten at a time with Shift', () => {
        const { result } = setup({ defaultValue: '#808080' });
        const start = result.current.hsv;

        act(() => result.current.area.onKeyDown(key('ArrowRight')));
        expect(result.current.hsv.s).toBe(start.s + 1);
        act(() => result.current.area.onKeyDown(key('ArrowUp', true)));
        expect(result.current.hsv.v).toBe(start.v + 10);
        act(() => result.current.area.onKeyDown(key('ArrowLeft')));
        expect(result.current.hsv.s).toBe(start.s);
    });

    it('ignores other keys', () => {
        const { result } = setup();
        const event = key('a');
        act(() => result.current.area.onKeyDown(event));
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('sets the hue', () => {
        const { result } = setup({ defaultValue: '#ff0000' });
        act(() => result.current.setHue(120));
        expect(result.current.hex).toBe('#00ff00');
    });

    it('does nothing while disabled', () => {
        const { result } = setup({ defaultValue: '#ff0000', disabled: true });
        act(() => result.current.area.onPointerDown(pointer(0, 0)));
        act(() => result.current.setHue(120));
        act(() => {
            result.current.setColor('#000');
        });
        expect(result.current.hex).toBe('#ff0000');
    });
});

describe('useColorPicker — hex field', () => {
    it('applies a valid draft', () => {
        const { result } = setup();
        act(() => result.current.setHexDraft('#abc'));
        act(() => result.current.commitHexDraft());
        expect(result.current.hex).toBe('#aabbcc');
        expect(result.current.hexDraft).toBe('#aabbcc');
    });

    it('restores an invalid draft', () => {
        const { result } = setup({ defaultValue: '#123456' });
        act(() => result.current.setHexDraft('oops'));
        act(() => result.current.commitHexDraft());
        expect(result.current.hexDraft).toBe('#123456');
    });
});

describe('useColorPicker — eyedropper', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('is unavailable without browser support', () => {
        const { result } = setup();
        expect(result.current.canUseEyeDropper).toBe(false);
    });

    it('applies the picked color', async () => {
        vi.stubGlobal(
            'EyeDropper',
            class {
                open = () => Promise.resolve({ sRGBHex: '#336699' });
            },
        );
        const { result } = setup();
        expect(result.current.canUseEyeDropper).toBe(true);

        await act(() => result.current.pickWithEyeDropper());

        expect(result.current.hex).toBe('#336699');
    });

    it('ignores a cancelled pick', async () => {
        vi.stubGlobal(
            'EyeDropper',
            class {
                open = () =>
                    Promise.reject(new DOMException('cancelled', 'AbortError'));
            },
        );
        const { result } = setup({ defaultValue: '#111111' });

        await act(() => result.current.pickWithEyeDropper());

        expect(result.current.hex).toBe('#111111');
    });

    it('rethrows other errors', async () => {
        vi.stubGlobal(
            'EyeDropper',
            class {
                open = () => Promise.reject(new Error('boom'));
            },
        );
        const { result } = setup();

        await expect(result.current.pickWithEyeDropper()).rejects.toThrow(
            'boom',
        );
    });
});
