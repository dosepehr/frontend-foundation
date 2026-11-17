import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import PriceInput from '.';

const meta: Meta<typeof PriceInput> = {
    title: 'UI/PriceInput',
    component: PriceInput,
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
        currency: { control: 'text' },
        currencyPosition: {
            control: 'inline-radio',
            options: ['start', 'end'],
        },
        thousandSeparator: { control: 'text' },
        decimalScale: { control: 'number' },
        fixedDecimalScale: { control: 'boolean' },
        min: { control: 'number' },
        max: { control: 'number' },
        showStepper: { control: 'boolean' },
        words: { control: 'inline-radio', options: ['fa', 'en', false] },
        wordsUnit: { control: 'text' },
        disabled: { control: 'boolean' },
        readOnly: { control: 'boolean' },
        required: { control: 'boolean' },
    },
    args: {
        label: 'Price',
        placeholder: 'Enter the price',
        currency: '$',
        words: 'en',
        wordsUnit: 'dollars',
    },
};

export default meta;
type Story = StoryObj<typeof PriceInput>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
    args: { defaultValue: 1249.99 },
};

export const FixedDecimals: Story = {
    args: {
        description: 'Always shows cents after you leave the field.',
        defaultValue: 20,
        fixedDecimalScale: true,
    },
};

export const CurrencyAtEnd: Story = {
    args: {
        currency: 'EUR',
        currencyPosition: 'end',
        defaultValue: 980.5,
    },
};

export const SpaceSeparator: Story = {
    args: {
        currency: 'kr',
        currencyPosition: 'end',
        thousandSeparator: ' ',
        defaultValue: 1250000,
    },
};

export const WholeAmounts: Story = {
    args: {
        label: 'Budget',
        description: 'No decimals allowed.',
        currency: 'JPY',
        currencyPosition: 'end',
        decimalScale: 0,
        defaultValue: 150000,
    },
};

export const WithMax: Story = {
    args: {
        label: 'Withdrawal',
        description: 'Up to $5,000 per day.',
        max: 5000,
    },
};

export const WithStepper: Story = {
    args: {
        label: 'Tip',
        step: 5,
        decimalScale: 0,
        showStepper: true,
        defaultValue: 15,
    },
};

export const PersianWords: Story = {
    args: {
        label: 'Price',
        description: 'The amount is written out in Persian under the input.',
        currency: 'Toman',
        currencyPosition: 'end',
        decimalScale: 0,
        words: 'fa',
        wordsUnit: 'تومان',
        defaultValue: 1000,
    },
};

export const EnglishWords: Story = {
    args: {
        defaultValue: 1250.5,
        words: 'en',
        wordsUnit: 'dollars',
    },
};

export const WithoutWords: Story = {
    args: {
        words: false,
        hint: 'Excluding tax.',
        defaultValue: 1250.5,
    },
};

export const WithoutCurrency: Story = {
    args: { currency: undefined },
};

export const Invalid: Story = {
    args: {
        defaultValue: 0,
        error: 'Price must be greater than zero.',
    },
};

export const Required: Story = {
    args: { required: true },
};

export const Disabled: Story = {
    args: { defaultValue: 99.9, disabled: true },
};

const RangeDemo = () => {
    const [min, setMin] = useState<number | null>(100);
    const [max, setMax] = useState<number | null>(500);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-2">
                <PriceInput
                    label="From"
                    currency="$"
                    value={min}
                    onValueChange={setMin}
                    max={max ?? undefined}
                />
                <PriceInput
                    label="To"
                    currency="$"
                    value={max}
                    onValueChange={setMax}
                    min={min ?? 0}
                />
            </div>
            <p className="text-sm text-muted-foreground">
                Range: <code>{JSON.stringify({ min, max })}</code>
            </p>
        </div>
    );
};

export const ControlledRange: Story = {
    render: () => <RangeDemo />,
};

export const RightToLeft: Story = {
    // Persian page: lang sets the Estedad font, dir the direction (also for portals).
    globals: { i18n: 'fa-IR' },
    render: (args) => (
        <div dir="rtl">
            <PriceInput {...args} />
        </div>
    ),
    args: {
        label: 'قیمت',
        placeholder: 'قیمت را وارد کنید',
        currency: 'تومان',
        currencyPosition: 'end',
        decimalScale: 0,
        words: 'fa',
        wordsUnit: 'تومان',
        defaultValue: 2500000,
    },
};
