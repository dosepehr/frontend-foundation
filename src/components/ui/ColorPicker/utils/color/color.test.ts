import { describe, expect, it } from 'vitest';
import {
    hexToHsv,
    hexToRgb,
    hsvToHex,
    hsvToRgb,
    normalizeHex,
    rgbToHex,
    rgbToHsv,
} from './color';

describe('normalizeHex', () => {
    it('expands short hex and lowercases', () => {
        expect(normalizeHex('#ABC')).toBe('#aabbcc');
        expect(normalizeHex('abc')).toBe('#aabbcc');
        expect(normalizeHex(' #FF0080 ')).toBe('#ff0080');
    });

    it('rejects invalid hex', () => {
        for (const value of [
            '',
            '#ab',
            '#abcd',
            '#gggggg',
            'red',
            '#1234567',
        ]) {
            expect(normalizeHex(value)).toBeNull();
        }
    });
});

describe('hex and RGB', () => {
    it('converts hex to RGB', () => {
        expect(hexToRgb('#ff8000')).toEqual({ r: 255, g: 128, b: 0 });
        expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
        expect(hexToRgb('nope')).toBeNull();
    });

    it('converts RGB to hex, rounding and clamping', () => {
        expect(rgbToHex({ r: 255, g: 128, b: 0 })).toBe('#ff8000');
        expect(rgbToHex({ r: 300, g: -5, b: 15.6 })).toBe('#ff0010');
    });
});

describe('RGB and HSV', () => {
    it('converts primary colors', () => {
        expect(rgbToHsv({ r: 255, g: 0, b: 0 })).toEqual({
            h: 0,
            s: 100,
            v: 100,
        });
        expect(rgbToHsv({ r: 0, g: 255, b: 0 })).toEqual({
            h: 120,
            s: 100,
            v: 100,
        });
        expect(rgbToHsv({ r: 0, g: 0, b: 255 })).toEqual({
            h: 240,
            s: 100,
            v: 100,
        });
    });

    it('converts grays with no hue or saturation', () => {
        expect(rgbToHsv({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, v: 0 });
        expect(rgbToHsv({ r: 128, g: 128, b: 128 })).toEqual({
            h: 0,
            s: 0,
            v: 50,
        });
    });

    it('handles hues that wrap below zero', () => {
        expect(rgbToHsv({ r: 255, g: 0, b: 128 }).h).toBe(330);
    });

    it('converts HSV back to RGB', () => {
        expect(hsvToRgb({ h: 0, s: 100, v: 100 })).toEqual({
            r: 255,
            g: 0,
            b: 0,
        });
        expect(hsvToRgb({ h: 120, s: 100, v: 50 })).toEqual({
            r: 0,
            g: 128,
            b: 0,
        });
        expect(hsvToRgb({ h: 0, s: 0, v: 100 })).toEqual({
            r: 255,
            g: 255,
            b: 255,
        });
        expect(hsvToRgb({ h: 360, s: 100, v: 100 })).toEqual({
            r: 255,
            g: 0,
            b: 0,
        });
    });

    it('round-trips through hex', () => {
        for (const hex of ['#ff8000', '#123456', '#00ffcc', '#808080']) {
            const hsv = hexToHsv(hex);
            expect(hsv).not.toBeNull();
            const back = hexToRgb(hsvToHex(hsv!));
            const original = hexToRgb(hex)!;
            // HSV is rounded to whole numbers, so allow a small drift.
            expect(Math.abs(back!.r - original.r)).toBeLessThanOrEqual(3);
            expect(Math.abs(back!.g - original.g)).toBeLessThanOrEqual(3);
            expect(Math.abs(back!.b - original.b)).toBeLessThanOrEqual(3);
        }
    });

    it('returns null for an invalid hex', () => {
        expect(hexToHsv('nope')).toBeNull();
    });
});
