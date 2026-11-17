import type {
    useColorPicker,
    UseColorPickerOptions,
} from './hooks/useColorPicker/useColorPicker';

export type ColorPickerProps = UseColorPickerOptions & {
    /** Preset colors shown as swatches; pass [] to hide them. */
    presets?: string[];
    /** Shows the RGB fields next to the hex field. */
    showRgb?: boolean;
    /** Shows the eyedropper button where the browser supports it. */
    showEyeDropper?: boolean;
    label?: string;
    description?: string;
    error?: string;
    required?: boolean;
    /** Submits the value in forms through a hidden input. */
    name?: string;
    id?: string;
    className?: string;
    triggerClassName?: string;
};

export type ColorPickerState = ReturnType<typeof useColorPicker>;

export type ColorPanelProps = {
    picker: ColorPickerState;
    presets: string[];
    showRgb: boolean;
    showEyeDropper: boolean;
};
