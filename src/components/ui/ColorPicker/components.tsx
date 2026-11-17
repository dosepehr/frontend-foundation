/* c8 ignore start */
'use client';
/* c8 ignore stop */

import Input from '@/components/ui/Input';
import NumberInput from '@/components/ui/NumberInput';
import { cn } from '@/utils/funcs/cn';
import { PipetteIcon } from 'lucide-react';
import { Slider as SliderPrimitive } from 'radix-ui';
import type { ColorPanelProps, ColorPickerState } from './ColorPicker.types';

const thumbClass =
    'block size-4 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3)] outline-none focus-visible:ring-3 focus-visible:ring-primary/50';

/** Saturation (x) and brightness (y) area for the current hue. */
const ColorArea = ({ picker }: { picker: ColorPickerState }) => {
    const { hsv, area } = picker;
    return (
        <div
            role="slider"
            tabIndex={0}
            aria-label="Saturation and brightness"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={hsv.s}
            aria-valuetext={`Saturation ${hsv.s}%, brightness ${hsv.v}%`}
            data-slot="color-area"
            dir="ltr"
            className="relative h-36 w-full cursor-crosshair touch-none rounded-md outline-none focus-visible:ring-3 focus-visible:ring-primary/50"
            style={{
                backgroundColor: `hsl(${hsv.h} 100% 50%)`,
                backgroundImage:
                    'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)',
            }}
            {...area}
        >
            <span
                className={cn(
                    thumbClass,
                    'pointer-events-none absolute -translate-x-1/2 -translate-y-1/2',
                )}
                style={{
                    left: `${hsv.s}%`,
                    top: `${100 - hsv.v}%`,
                    backgroundColor: picker.hex,
                }}
            />
        </div>
    );
};

/** Rainbow slider for the hue. */
const HueSlider = ({
    picker,
    disabled,
}: {
    picker: ColorPickerState;
    disabled?: boolean;
}) => (
    <SliderPrimitive.Root
        dir="ltr"
        min={0}
        max={360}
        step={1}
        value={[picker.hsv.h]}
        onValueChange={([hue]) => picker.setHue(hue)}
        disabled={disabled}
        className="relative flex h-4 w-full touch-none items-center select-none data-disabled:opacity-50"
    >
        <SliderPrimitive.Track
            className="relative h-3 w-full grow rounded-full"
            style={{
                background:
                    'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
            }}
        />
        <SliderPrimitive.Thumb
            aria-label="Hue"
            className={thumbClass}
            style={{ backgroundColor: `hsl(${picker.hsv.h} 100% 50%)` }}
        />
    </SliderPrimitive.Root>
);

/** Preset color buttons. */
const ColorSwatches = ({
    picker,
    presets,
}: {
    picker: ColorPickerState;
    presets: string[];
}) => (
    <div
        className="grid grid-cols-8 gap-1.5"
        role="group"
        aria-label="Preset colors"
    >
        {presets.map((preset) => {
            const isSelected = preset.toLowerCase() === picker.hex;
            return (
                <button
                    key={preset}
                    type="button"
                    aria-label={preset}
                    aria-pressed={isSelected}
                    onClick={() => picker.setColor(preset)}
                    className={cn(
                        'aspect-square rounded-sm border border-black/10 transition-transform outline-none hover:scale-110',
                        'focus-visible:ring-3 focus-visible:ring-primary/50',
                        isSelected &&
                            'ring-2 ring-primary ring-offset-1 ring-offset-background',
                    )}
                    style={{ backgroundColor: preset }}
                />
            );
        })}
    </div>
);

const RGB_CHANNELS = [
    { key: 'r', label: 'Red' },
    { key: 'g', label: 'Green' },
    { key: 'b', label: 'Blue' },
] as const;

/** Hex field with the eyedropper, then the optional RGB fields. */
const ColorFields = ({
    picker,
    showRgb,
    showEyeDropper,
}: Omit<ColorPanelProps, 'presets'>) => (
    <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
            {showEyeDropper && picker.canUseEyeDropper && (
                <button
                    type="button"
                    aria-label="Pick a color from the screen"
                    title="Pick a color from the screen"
                    onClick={() => void picker.pickWithEyeDropper()}
                    className="flex size-9 shrink-0 items-center justify-center rounded-md border border-input/50 text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                    <PipetteIcon className="size-4" />
                </button>
            )}
            <div className="min-w-0 flex-1">
                <Input
                    aria-label="Hex"
                    startAddon="#"
                    value={picker.hexDraft.replace(/^#/, '')}
                    onChange={(event) =>
                        picker.setHexDraft(
                            `#${event.target.value.replace(/^#/, '')}`,
                        )
                    }
                    onBlur={picker.commitHexDraft}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') picker.commitHexDraft();
                    }}
                    maxLength={7}
                    spellCheck={false}
                    className="font-mono uppercase"
                />
            </div>
        </div>
        {showRgb && (
            <div className="grid grid-cols-3 gap-2">
                {RGB_CHANNELS.map(({ key, label }) => (
                    <NumberInput
                        key={key}
                        aria-label={label}
                        startAddon={key.toUpperCase()}
                        min={0}
                        max={255}
                        decimalScale={0}
                        showStepper={false}
                        value={picker.rgb[key]}
                        onValueChange={(next) => {
                            if (next !== null && next <= 255)
                                picker.setRgb({ [key]: next });
                        }}
                        className="px-2"
                    />
                ))}
            </div>
        )}
    </div>
);

/** Everything inside the popover. */
const ColorPanel = ({
    picker,
    presets,
    showRgb,
    showEyeDropper,
}: ColorPanelProps) => (
    <div className="flex w-64 flex-col gap-3">
        <ColorArea picker={picker} />
        <HueSlider picker={picker} />
        <ColorFields
            picker={picker}
            showRgb={showRgb}
            showEyeDropper={showEyeDropper}
        />
        {presets.length > 0 && (
            <ColorSwatches picker={picker} presets={presets} />
        )}
    </div>
);

export { ColorArea, ColorFields, ColorPanel, ColorSwatches, HueSlider };
