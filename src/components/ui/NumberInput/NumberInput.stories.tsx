import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import NumberInput from '.';

const meta: Meta<typeof NumberInput> = {
    title: 'UI/NumberInput',
    component: NumberInput,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className="w-72">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        label: { control: 'text' },
        description: { control: 'text' },
        error: { control: 'text' },
        placeholder: { control: 'text' },
        min: { control: 'number' },
        max: { control: 'number' },
        step: { control: 'number' },
        decimalScale: { control: 'number' },
        fixedDecimalScale: { control: 'boolean' },
        allowNegative: { control: 'boolean' },
        thousandSeparator: { control: 'text' },
        showStepper: { control: 'boolean' },
        disabled: { control: 'boolean' },
        readOnly: { control: 'boolean' },
        required: { control: 'boolean' },
    },
    args: {
        label: 'Quantity',
        placeholder: 'Enter the quantity',
    },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
    args: { defaultValue: 3 },
};

export const MinMax: Story = {
    args: {
        label: 'Guests',
        description:
            'Between 1 and 10. Values outside the range snap back on blur.',
        min: 1,
        max: 10,
        defaultValue: 2,
    },
};

export const CustomStep: Story = {
    args: {
        label: 'Volume',
        description: 'Arrow keys step by 5, Page Up/Down by 50.',
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 50,
    },
};

export const Decimal: Story = {
    args: {
        label: 'Weight',
        step: 0.1,
        decimalScale: 2,
        fixedDecimalScale: true,
        defaultValue: 1.5,
        endAddon: 'kg',
    },
};

export const IntegerOnly: Story = {
    args: {
        label: 'Age',
        decimalScale: 0,
        min: 0,
        max: 150,
    },
};

export const AllowNegative: Story = {
    args: {
        label: 'Temperature',
        min: -50,
        max: 50,
        defaultValue: -5,
        endAddon: '°C',
    },
};

export const ThousandSeparator: Story = {
    args: {
        label: 'Population',
        thousandSeparator: ',',
        decimalScale: 0,
        defaultValue: 8_100_000_000,
        showStepper: false,
    },
};

export const WithHint: Story = {
    args: {
        label: 'Storage',
        endAddon: 'MB',
        min: 0,
        defaultValue: 2048,
        thousandSeparator: ',',
        hint: (value) =>
            value === null
                ? 'Enter a size'
                : `≈ ${(value / 1024).toFixed(2)} GB`,
    },
};

export const WithoutStepper: Story = {
    args: { showStepper: false },
};

export const WithStartAddon: Story = {
    args: {
        label: 'Discount',
        startAddon: '%',
        min: 0,
        max: 100,
    },
};

export const Invalid: Story = {
    args: {
        defaultValue: 0,
        error: 'Quantity must be at least 1.',
    },
};

export const Required: Story = {
    args: { required: true },
};

export const Disabled: Story = {
    args: { defaultValue: 4, disabled: true },
};

export const ReadOnly: Story = {
    args: { defaultValue: 4, readOnly: true },
};

const ControlledDemo = () => {
    const [value, setValue] = useState<number | null>(12);

    return (
        <div className="flex flex-col gap-3">
            <NumberInput
                label="Controlled"
                value={value}
                onValueChange={setValue}
                min={0}
                max={100}
            />
            <p className="text-sm text-muted-foreground">
                Value: <code>{JSON.stringify(value)}</code>
            </p>
            <button
                type="button"
                className="self-start text-sm text-primary underline"
                onClick={() => setValue(null)}
            >
                Clear
            </button>
        </div>
    );
};

export const Controlled: Story = {
    render: () => <ControlledDemo />,
};

export const RightToLeft: Story = {
    render: (args) => (
        <div dir="rtl">
            <NumberInput {...args} />
        </div>
    ),
    args: {
        label: 'تعداد',
        placeholder: 'تعداد را وارد کنید',
        description: 'ارقام فارسی هم پذیرفته می‌شوند.',
        thousandSeparator: ',',
        endAddon: 'عدد',
    },
};
