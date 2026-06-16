import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React, { useState } from 'react';
import { ComboBox } from './combo-box';
import type { ComboBoxOption } from './combo-box.type';

const FRUITS: ComboBoxOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'mango', label: 'Mango' },
    { value: 'orange', label: 'Orange' },
    { value: 'grape', label: 'Grape' },
    { value: 'watermelon', label: 'Watermelon' },
    { value: 'peach', label: 'Peach' },
];

const CITIES: ComboBoxOption[] = [
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

const meta: Meta<typeof ComboBox> = {
    title: 'UI/ComboBox',
    component: ComboBox,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className='w-72'>
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
    },
};

export default meta;
type Story = StoryObj<typeof ComboBox>;

function Controlled(props: Partial<React.ComponentProps<typeof ComboBox>>) {
    const [value, setValue] = useState('');
    return (
        <ComboBox
            options={FRUITS}
            value={value}
            onChange={setValue}
            {...props}
        />
    );
}

export const Default: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Fruit',
        placeholder: 'Select a fruit',
    },
};

export const Required: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Fruit',
        placeholder: 'Select a fruit',
        required: true,
    },
};

export const WithError: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Fruit',
        placeholder: 'Select a fruit',
        error: 'Please select an option.',
        required: true,
    },
};

export const Disabled: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Fruit',
        placeholder: 'Select a fruit',
        disabled: true,
    },
};

export const Loading: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Fruit',
        placeholder: 'Select a fruit',
        isPending: true,
    },
};

export const ErrorState: Story = {
    render: (args) => <Controlled {...args} />,
    args: {
        label: 'Fruit',
        placeholder: 'Failed to load',
        isError: true,
    },
};

export const Empty: Story = {
    render: (args) => {
        const [value, setValue] = useState('');
        return (
            <ComboBox
                {...args}
                options={[]}
                value={value}
                onChange={setValue}
            />
        );
    },
    args: {
        label: 'Fruit',
        placeholder: 'Select a fruit',
        notFoundText: 'No options available.',
    },
};

export const WithLongList: Story = {
    render: (args) => {
        const [value, setValue] = useState('');
        return (
            <ComboBox
                {...args}
                options={CITIES}
                value={value}
                onChange={setValue}
            />
        );
    },
    args: {
        label: 'City',
        placeholder: 'Select a city',
    },
};

