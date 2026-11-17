// Conversions between hex, RGB and HSV colors (no alpha).

export type Rgb = { r: number; g: number; b: number };
/** Hue 0–360, saturation and value 0–100. */
export type Hsv = { h: number; s: number; v: number };

const HEX_PATTERN = /^#?([\da-f]{3}|[\da-f]{6})$/i;

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

/** Expands and lowercases "#abc" / "abc" / "#AABBCC" to "#aabbcc"; null if invalid. */
export function normalizeHex(value: string) {
    const match = HEX_PATTERN.exec(value.trim());
    if (!match) return null;
    const digits =
        match[1].length === 3
            ? [...match[1]].map((d) => d + d).join('')
            : match[1];
    return `#${digits.toLowerCase()}`;
}

export function hexToRgb(hex: string): Rgb | null {
    const normalized = normalizeHex(hex);
    if (!normalized) return null;
    const number = Number.parseInt(normalized.slice(1), 16);
    return { r: (number >> 16) & 255, g: (number >> 8) & 255, b: number & 255 };
}

export function rgbToHex({ r, g, b }: Rgb) {
    return `#${[r, g, b]
        .map((channel) =>
            Math.round(clamp(channel, 0, 255))
                .toString(16)
                .padStart(2, '0'),
        )
        .join('')}`;
}

export function rgbToHsv({ r, g, b }: Rgb): Hsv {
    const [red, green, blue] = [r / 255, g / 255, b / 255];
    const max = Math.max(red, green, blue);
    const delta = max - Math.min(red, green, blue);

    let h = 0;
    if (delta !== 0) {
        if (max === red) h = ((green - blue) / delta) % 6;
        else if (max === green) h = (blue - red) / delta + 2;
        else h = (red - green) / delta + 4;
    }

    return {
        h: (Math.round(h * 60) + 360) % 360,
        s: max === 0 ? 0 : Math.round((delta / max) * 100),
        v: Math.round(max * 100),
    };
}

export function hsvToRgb({ h, s, v }: Hsv): Rgb {
    const saturation = clamp(s, 0, 100) / 100;
    const value = clamp(v, 0, 100) / 100;
    const channel = (n: number) => {
        const k = (n + clamp(h, 0, 360) / 60) % 6;
        return Math.round(
            (value - value * saturation * Math.max(0, Math.min(k, 4 - k, 1))) *
                255,
        );
    };
    return { r: channel(5), g: channel(3), b: channel(1) };
}

export const hexToHsv = (hex: string) => {
    const rgb = hexToRgb(hex);
    return rgb ? rgbToHsv(rgb) : null;
};

export const hsvToHex = (hsv: Hsv) => rgbToHex(hsvToRgb(hsv));
