import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MapPinIcon } from 'lucide-react';
import SelectWrapper from '.';

const FRUITS = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'durian', label: 'Durian', disabled: true },
    { value: 'elderberry', label: 'Elderberry' },
];

const COUNTRIES = [
    { value: 'ir', label: 'Iran' },
    { value: 'us', label: 'United States' },
    { value: 'de', label: 'Germany' },
    { value: 'jp', label: 'Japan' },
    { value: 'br', label: 'Brazil' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
];

const meta: Meta<typeof SelectWrapper> = {
    title: 'UI/Select',
    component: SelectWrapper,
    tags: ['autodocs'],
    argTypes: {
        label: { control: 'text' },
        description: { control: 'text' },
        error: { control: 'text' },
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
        isLoading: { control: 'boolean' },
        isError: { control: 'boolean' },
    },
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className="w-72">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof SelectWrapper>;

export const Default: Story = {
    args: {
        label: 'Fruit',
        placeholder: 'Select a fruit',
        options: FRUITS,
    },
};

export const WithDescription: Story = {
    args: {
        label: 'Country',
        description: 'Select the country you currently live in.',
        placeholder: 'Select a country',
        options: COUNTRIES,
    },
};

export const Required: Story = {
    args: {
        label: 'Fruit',
        placeholder: 'Select a fruit',
        options: FRUITS,
        required: true,
    },
};

export const Invalid: Story = {
    args: {
        label: 'Fruit',
        placeholder: 'Select a fruit',
        options: FRUITS,
        error: 'Please select an option.',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Fruit',
        placeholder: 'Select a fruit',
        options: FRUITS,
        disabled: true,
    },
};

export const WithStartAddon: Story = {
    args: {
        label: 'Country',
        placeholder: 'Select a country',
        options: COUNTRIES,
        startAddon: <MapPinIcon className="size-4" />,
    },
};

export const Loading: Story = {
    args: {
        label: 'Fruit',
        placeholder: 'Select a fruit',
        isLoading: true,
    },
};

export const ErrorState: Story = {
    args: {
        label: 'Fruit',
        placeholder: 'Select a fruit',
        isError: true,
    },
};

export const Empty: Story = {
    args: {
        label: 'Fruit',
        placeholder: 'Select a fruit',
        options: [],
    },
};

export const WithDisabledOption: Story = {
    args: {
        label: 'Fruit',
        placeholder: 'Select a fruit',
        options: FRUITS,
        description: 'Durian is currently unavailable.',
    },
};
