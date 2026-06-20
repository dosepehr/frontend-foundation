import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React, { useState } from 'react';
import { MultiInput } from './components';

const meta: Meta<typeof MultiInput> = {
    title: 'UI/MultiInput',
    component: MultiInput,
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
        placeholder: { control: 'text' },
        error: { control: 'text' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
        maxLength: { control: 'number' },
    },
};

export default meta;
type Story = StoryObj<typeof MultiInput>;

function Controlled(props: Partial<React.ComponentProps<typeof MultiInput>>) {
    const [value, setValue] = useState<string[]>([]);
    return <MultiInput value={value} onChange={setValue} {...props} />;
}

export const Default: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Tags',
        placeholder: 'Type and press Enter',
    },
};

export const WithPrefilledValues: Story = {
    render: (args) => {
        const [value, setValue] = useState(['React', 'TypeScript', 'Next.js']);
        return <MultiInput {...args} value={value} onChange={setValue} />;
    },
    args: {
        label: 'Tags',
    },
};

export const Required: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Tags',
        required: true,
    },
};

export const WithError: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Tags',
        error: 'Please add at least one tag.',
        required: true,
    },
};

export const Disabled: Story = {
    render: () => (
        <MultiInput label="Tags" value={['React', 'TypeScript']} disabled />
    ),
};

export const WithMaxLength: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Short Tags',
        placeholder: 'Max 10 characters',
        maxLength: 10,
    },
};
