'use client';

import { useControllableState } from '@/hooks/useControllableState';
import { useState, type KeyboardEvent, type PointerEvent } from 'react';
import {
    hexToHsv,
    hexToRgb,
    hsvToHex,
    normalizeHex,
    rgbToHex,
    type Hsv,
    type Rgb,
} from '../../utils/color/color';

type EyeDropperResult = { sRGBHex: string };
type EyeDropperConstructor = new () => {
    open: () => Promise<EyeDropperResult>;
};

const getEyeDropper = () =>
    typeof window === 'undefined'
        ? undefined
        : (window as unknown as { EyeDropper?: EyeDropperConstructor })
              .EyeDropper;

export type UseColorPickerOptions = {
    /** "#rrggbb". */
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
};

const clamp = (value: number) => Math.min(Math.max(value, 0), 100);
const BLACK: Hsv = { h: 0, s: 0, v: 0 };

/**
 * State for a color picker. Keeps an HSV copy of the color so the hue
 * survives grays (where hex has no hue) while the user drags.
 */
export function useColorPicker({
    value,
    defaultValue = '#000000',
    onValueChange,
    disabled = false,
}: UseColorPickerOptions) {
    const [rawHex, setHex] = useControllableState({
        value,
        defaultValue,
        onChange: onValueChange,
    });
    const hex = normalizeHex(rawHex) ?? '#000000';
    const [hsv, setHsvState] = useState<Hsv>(() => hexToHsv(hex) ?? BLACK);
    const [syncedHex, setSyncedHex] = useState(hex);
    const [hexDraft, setHexDraft] = useState(hex);
    const [isDragging, setIsDragging] = useState(false);

    // A new hex from outside resets the HSV copy and the hex field.
    if (hex !== syncedHex) {
        setSyncedHex(hex);
        setHexDraft(hex);
        if (hsvToHex(hsv) !== hex) setHsvState(hexToHsv(hex) ?? BLACK);
    }

    const setHsv = (next: Hsv) => {
        if (disabled) return;
        const nextHex = hsvToHex(next);
        setHsvState(next);
        setSyncedHex(nextHex);
        setHexDraft(nextHex);
        setHex(nextHex);
    };

    const setColor = (next: string) => {
        const normalized = normalizeHex(next);
        if (!normalized || disabled) return false;
        setHex(normalized);
        return true;
    };

    const pointTo = (event: PointerEvent<HTMLElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = rect.width
            ? ((event.clientX - rect.left) / rect.width) * 100
            : 0;
        const y = rect.height
            ? ((event.clientY - rect.top) / rect.height) * 100
            : 0;
        setHsv({
            ...hsv,
            s: Math.round(clamp(x)),
            v: Math.round(100 - clamp(y)),
        });
    };

    const area = {
        onPointerDown: (event: PointerEvent<HTMLElement>) => {
            if (disabled) return;
            event.currentTarget.setPointerCapture?.(event.pointerId);
            setIsDragging(true);
            pointTo(event);
        },
        onPointerMove: (event: PointerEvent<HTMLElement>) => {
            if (isDragging) pointTo(event);
        },
        onPointerUp: () => setIsDragging(false),
        onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
            const step = event.shiftKey ? 10 : 1;
            const moves: Record<string, Partial<Hsv>> = {
                ArrowRight: { s: clamp(hsv.s + step) },
                ArrowLeft: { s: clamp(hsv.s - step) },
                ArrowUp: { v: clamp(hsv.v + step) },
                ArrowDown: { v: clamp(hsv.v - step) },
            };
            const move = moves[event.key];
            if (!move) return;
            event.preventDefault();
            setHsv({ ...hsv, ...move });
        },
    };

    // From the hex, not the HSV copy, so typed channels never drift by rounding.
    const rgb = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };
    const EyeDropper = getEyeDropper();

    return {
        hex,
        hsv,
        rgb,
        area,
        setHue: (h: number) => setHsv({ ...hsv, h }),
        setRgb: (patch: Partial<Rgb>) =>
            setColor(rgbToHex({ ...rgb, ...patch })),
        setColor,
        hexDraft,
        setHexDraft,
        /** Applies the typed hex if valid, otherwise restores the current one. */
        commitHexDraft: () => {
            if (!setColor(hexDraft)) setHexDraft(hex);
        },
        canUseEyeDropper: EyeDropper !== undefined,
        pickWithEyeDropper: async () => {
            if (!EyeDropper || disabled) return;
            try {
                const result = await new EyeDropper().open();
                setColor(result.sRGBHex);
            } catch (error) {
                // Closing the eyedropper without picking rejects with AbortError.
                if (
                    error instanceof DOMException &&
                    error.name === 'AbortError'
                )
                    return;
                throw error;
            }
        },
    };
}
