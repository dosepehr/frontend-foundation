import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React, { useState } from 'react';
import { MultiComboBox } from './components';
import { type MultiComboBoxOption } from './multi-combo-box.types';

const FRUITS: MultiComboBoxOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'mango', label: 'Mango' },
    { value: 'orange', label: 'Orange' },
    { value: 'grape', label: 'Grape' },
    { value: 'watermelon', label: 'Watermelon' },
    { value: 'peach', label: 'Peach' },
];

const CITIES: MultiComboBoxOption[] = [
    { value: 'new-york', label: 'New York' },
    { value: 'london', label: 'London' },
    { value: 'paris', label: 'Paris' },
    { value: 'tokyo', label: 'Tokyo' },
    { value: 'berlin', label: 'Berlin' },
    { value: 'sydney', label: 'Sydney' },
    { value: 'toronto', label: 'Toronto' },
    { value: 'dubai', label: 'Dubai' },
    { value: 'singapore', label: 'Singapore' },
    { value: 'amsterdam', label: 'Amsterdam' },
];

const meta: Meta<typeof MultiComboBox> = {
    title: 'UI/MultiComboBox',
    component: MultiComboBox,
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
        searchPlaceholder: { control: 'text' },
        notFoundText: { control: 'text' },
        error: { control: 'text' },
        disabled: { control: 'boolean' },
        isPending: { control: 'boolean' },
        isError: { control: 'boolean' },
        required: { control: 'boolean' },
        hideSelectedBadges: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof MultiComboBox>;

function Controlled(
    props: Partial<React.ComponentProps<typeof MultiComboBox>>,
) {
    const [selected, setSelected] = useState<string[]>([]);
    return (
        <MultiComboBox
            options={FRUITS}
            selected={selected}
            onChange={setSelected}
            {...props}
        />
    );
}

export const Default: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Fruits',
        placeholder: 'Select fruits',
    },
};

export const WithPreselected: Story = {
    render: (args) => {
        const [selected, setSelected] = useState(['apple', 'banana']);
        return (
            <MultiComboBox
                {...args}
                options={FRUITS}
                selected={selected}
                onChange={setSelected}
            />
        );
    },
    args: {
        label: 'Fruits',
    },
};

export const Required: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Fruits',
        required: true,
    },
};

export const WithError: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Fruits',
        error: 'Please select at least one option.',
        required: true,
    },
};

export const Disabled: Story = {
    render: () => (
        <MultiComboBox
            options={FRUITS}
            selected={['apple', 'banana']}
            label="Fruits"
            disabled
        />
    ),
};

export const Loading: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Fruits',
        isPending: true,
    },
};

export const ErrorState: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Fruits',
        isError: true,
    },
};

export const Empty: Story = {
    render: () => {
        const [selected, setSelected] = useState<string[]>([]);
        return (
            <MultiComboBox
                options={[]}
                selected={selected}
                onChange={setSelected}
                label="Fruits"
                notFoundText="No options available."
            />
        );
    },
};

export const HideSelectedBadges: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Fruits',
        hideSelectedBadges: true,
    },
};

export const WithLongList: Story = {
    render: (args) => {
        const [selected, setSelected] = useState<string[]>([]);
        return (
            <MultiComboBox
                {...args}
                options={CITIES}
                selected={selected}
                onChange={setSelected}
            />
        );
    },
    args: {
        label: 'Cities',
        placeholder: 'Select cities',
    },
};
