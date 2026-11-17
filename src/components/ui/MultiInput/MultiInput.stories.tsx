import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React, { useState } from 'react';
import MultiInput from '.';

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

export const CommaSeparated: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Skills',
        placeholder: 'Type, then press Enter or a comma',
    },
};

export const PasteAList: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Emails',
        placeholder: 'Paste a comma or line separated list',
    },
};

export const WithMaxItems: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Top 3 colors',
        placeholder: 'Up to 3 items',
        maxItems: 3,
    },
};

export const CustomSeparators: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Keywords',
        placeholder: 'Separate with Enter or ;',
        separators: ['Enter', ';'],
    },
};

export const AddOnBlur: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Labels',
        placeholder: 'The typed text is added when you leave the field',
        addOnBlur: true,
    },
};
