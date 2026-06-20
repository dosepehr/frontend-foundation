import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React, { useState } from 'react';
import { OtpInput } from './components';

const meta: Meta<typeof OtpInput> = {
    title: 'UI/OtpInput',
    component: OtpInput,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    argTypes: {
        label: { control: 'text' },
        error: { control: 'text' },
        length: { control: { type: 'number', min: 1, max: 8 } },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof OtpInput>;

function Controlled(props: Partial<React.ComponentProps<typeof OtpInput>>) {
    const [value, setValue] = useState('');
    return <OtpInput value={value} onChange={setValue} {...props} />;
}

export const Default: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Verification Code',
        length: 6,
    },
};

export const FourDigits: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'PIN',
        length: 4,
    },
};

export const Required: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Verification Code',
        length: 6,
        required: true,
    },
};

export const WithError: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Verification Code',
        length: 6,
        error: 'Invalid code. Please try again.',
        required: true,
    },
};

export const Disabled: Story = {
    render: () => (
        <OtpInput
            label="Verification Code"
            length={6}
            value="123456"
            disabled
        />
    ),
};

export const SeparateInputs: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Verification Code',
        length: 4,
        separated: true,
    },
};

export const SeparateInputsWithError: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Verification Code',
        length: 4,
        separated: true,
        error: 'Invalid code. Please try again.',
    },
};

export const WithOnComplete: Story = {
    render: (args) => {
        const [value, setValue] = useState('');
        const [completed, setCompleted] = useState(false);
        return (
            <div className="flex flex-col gap-3">
                <OtpInput
                    {...args}
                    value={value}
                    onChange={(v) => {
                        setValue(v);
                        setCompleted(false);
                    }}
                    onComplete={() => setCompleted(true)}
                />
                {completed && (
                    <p className="text-sm text-green-600">
                        Code submitted: {value}
                    </p>
                )}
            </div>
        );
    },
    args: {
        label: 'Verification Code',
        length: 6,
    },
};
