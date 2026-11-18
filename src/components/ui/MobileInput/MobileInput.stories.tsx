import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import MobileInput from '.';
import { isValidMobile } from './utils/mobile/mobile';

const meta: Meta<typeof MobileInput> = {
    title: 'UI/MobileInput',
    component: MobileInput,
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
        separator: { control: 'text' },
        disabled: { control: 'boolean' },
        readOnly: { control: 'boolean' },
        required: { control: 'boolean' },
    },
    args: {
        label: 'Mobile number',
        placeholder: 'Enter the mobile number',
    },
};

export default meta;
type Story = StoryObj<typeof MobileInput>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
    args: {
        description: 'Given as +989121234567, shown normalized.',
        defaultValue: '+989121234567',
    },
};

export const DashSeparator: Story = {
    args: { separator: '-', defaultValue: '09121234567' },
};

export const WithoutGrouping: Story = {
    args: { separator: '', defaultValue: '09121234567' },
};

export const WithStartAddon: Story = {
    args: { startAddon: 'IR', defaultValue: '09121234567' },
};

export const Invalid: Story = {
    args: {
        defaultValue: '0912123',
        error: 'Enter a valid mobile number.',
    },
};

export const Required: Story = {
    args: { required: true },
};

export const Disabled: Story = {
    args: { defaultValue: '09121234567', disabled: true },
};

const NormalizedDemo = () => {
    const [value, setValue] = useState('');

    return (
        <div className="flex flex-col gap-3">
            <MobileInput
                label="Mobile number"
                description="Try +98 912 123 4567, 0098…, or Persian digits."
                placeholder="Enter the mobile number"
                value={value}
                onValueChange={setValue}
            />
            <p className="text-sm text-muted-foreground">
                Value: <code>{JSON.stringify(value)}</code> ·{' '}
                {isValidMobile(value) ? 'valid' : 'incomplete'}
            </p>
        </div>
    );
};

export const Normalized: Story = {
    render: () => <NormalizedDemo />,
};

export const RightToLeft: Story = {
    // Persian page: lang sets the Estedad font, dir the direction (also for portals).
    globals: { i18n: 'fa-IR' },
    render: (args) => (
        <div dir="rtl">
            <MobileInput {...args} />
        </div>
    ),
    args: {
        label: 'شماره موبایل',
        placeholder: 'شماره موبایل را وارد کنید',
        defaultValue: '۰۹۱۲۱۲۳۴۵۶۷',
    },
};
