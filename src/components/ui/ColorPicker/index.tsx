/* c8 ignore start */
'use client';
/* c8 ignore stop */

import Field, {
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/Field';
import Popover, {
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/Popover';
import { cn } from '@/utils/funcs/cn';
import { ChevronDownIcon } from 'lucide-react';
import { useId, useState } from 'react';
import type { ColorPickerProps } from './ColorPicker.types';
import { ColorPanel } from './components';
import { useColorPicker } from './hooks/useColorPicker/useColorPicker';

const DEFAULT_PRESETS = [
    '#000000',
    '#6b7280',
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#eab308',
    '#84cc16',
    '#22c55e',
    '#14b8a6',
    '#06b6d4',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#a855f7',
    '#ec4899',
    '#ffffff',
];

// Same look as the DatePicker and ComboBox triggers.
const TRIGGER_CLASS = cn(
    'group/trigger flex h-9 w-full items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow,border] outline-none select-none',
    'border-input/50 hover:enabled:not-aria-invalid:border-primary',
    'focus-visible:not-aria-invalid:border-primary focus-visible:not-aria-invalid:ring-3 focus-visible:not-aria-invalid:ring-primary/50',
    'aria-expanded:not-aria-invalid:border-primary aria-expanded:not-aria-invalid:ring-3 aria-expanded:not-aria-invalid:ring-primary/50',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/50 aria-invalid:hover:border-destructive',
);

const ColorPicker = ({
    presets = DEFAULT_PRESETS,
    showRgb = true,
    showEyeDropper = true,
    label,
    description,
    error,
    required,
    name,
    id,
    className,
    triggerClassName,
    disabled,
    ...options
}: ColorPickerProps) => {
    const generatedId = useId();
    const triggerId = id ?? generatedId;
    const [open, setOpen] = useState(false);
    const picker = useColorPicker({ ...options, disabled });

    return (
        <Field
            data-invalid={!!error || undefined}
            className={cn('relative pb-1', className)}
        >
            {label && (
                <FieldLabel
                    htmlFor={triggerId}
                    required={required}
                    className="text-foreground"
                >
                    {label}
                </FieldLabel>
            )}
            {description && (
                <FieldDescription className="text-muted-foreground">
                    {description}
                </FieldDescription>
            )}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props -- popover triggers expose their state with aria-expanded */}
                    <button
                        type="button"
                        id={triggerId}
                        disabled={disabled}
                        aria-expanded={open}
                        aria-invalid={!!error || undefined}
                        className={cn(TRIGGER_CLASS, triggerClassName)}
                    >
                        <span
                            data-slot="color-preview"
                            className="size-4 shrink-0 rounded-sm border border-black/10"
                            style={{ backgroundColor: picker.hex }}
                        />
                        <span className="flex-1 truncate text-start font-mono text-foreground uppercase">
                            {picker.hex}
                        </span>
                        <ChevronDownIcon
                            aria-hidden
                            className={cn(
                                'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                                open && 'rotate-180',
                            )}
                        />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    aria-label={label ?? 'Choose a color'}
                    align="start"
                    sideOffset={5}
                    className="w-auto p-3"
                >
                    <ColorPanel
                        picker={picker}
                        presets={presets}
                        showRgb={showRgb}
                        showEyeDropper={showEyeDropper}
                    />
                </PopoverContent>
            </Popover>
            {name && (
                <input
                    type="hidden"
                    name={name}
                    value={picker.hex}
                    disabled={disabled}
                />
            )}
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
};

export default ColorPicker;
