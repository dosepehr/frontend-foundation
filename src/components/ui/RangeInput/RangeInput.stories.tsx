import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import RangeInput from '.';
import type { RangeValue } from './RangeInput.types';

const meta: Meta<typeof RangeInput> = {
    title: 'UI/RangeInput',
    component: RangeInput,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        label: { control: 'text' },
        description: { control: 'text' },
        error: { control: 'text' },
        min: { control: 'number' },
        max: { control: 'number' },
        step: { control: 'number' },
        showSlider: { control: 'boolean' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
    },
    args: { label: 'Age' },
};

export default meta;
type Story = StoryObj<typeof RangeInput>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
    args: { defaultValue: [18, 65] },
};

export const WithSlider: Story = {
    args: {
        label: 'Price',
        description: 'Drag the slider or type exact amounts.',
        min: 0,
        max: 1000,
        step: 10,
        showSlider: true,
        startAddon: '$',
        thousandSeparator: ',',
        defaultValue: [100, 600],
    },
};

export const OpenEnded: Story = {
    args: {
        label: 'Year built',
        description: 'Leave a side empty for no limit.',
        min: 1900,
        max: 2026,
        decimalScale: 0,
        defaultValue: [2000, null],
    },
};

export const Decimal: Story = {
    args: {
        label: 'Rating',
        min: 0,
        max: 5,
        step: 0.5,
        decimalScale: 1,
        showSlider: true,
    },
};

export const Invalid: Story = {
    args: { error: 'Choose a minimum age.' },
};

export const Required: Story = {
    args: { required: true },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: [20, 30],
        showSlider: true,
        min: 0,
        max: 100,
    },
};

const ControlledDemo = () => {
    const [range, setRange] = useState<RangeValue>([20, 80]);
    return (
        <div className="flex flex-col gap-3">
            <RangeInput
                label="Discount"
                endAddon="%"
                min={0}
                max={100}
                showSlider
                value={range}
                onValueChange={setRange}
            />
            <p className="text-sm text-muted-foreground">
                Value: <code>{JSON.stringify(range)}</code>
            </p>
        </div>
    );
};

export const Controlled: Story = {
    render: () => <ControlledDemo />,
};

export const RightToLeft: Story = {
    // Persian page: lang sets the Estedad font, dir the direction (also for portals).
    globals: { i18n: 'fa-IR' },
    render: (args) => (
        <div dir="rtl">
            <RangeInput {...args} />
        </div>
    ),
    args: {
        label: 'محدوده قیمت',
        fromPlaceholder: 'از',
        toPlaceholder: 'تا',
        fromLabel: 'حداقل قیمت',
        toLabel: 'حداکثر قیمت',
        endAddon: 'تومان',
        thousandSeparator: ',',
        min: 0,
        max: 10_000_000,
        step: 100_000,
        showSlider: true,
    },
};
