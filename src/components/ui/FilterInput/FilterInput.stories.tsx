import type { Filter, FilterOption } from '@/utils/funcs/filters';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import FilterInput from '.';

const OPTIONS: FilterOption[] = [
    { value: 'active', label: 'Active' },
    { value: 'invited', label: 'Invited' },
    { value: 'suspended', label: 'Suspended' },
];

/** FilterInput keeps no state: each demo holds its filter's value. */
const SelectDemo = (extra: Partial<Extract<Filter, { type: 'select' }>>) => {
    const [value, setValue] = useState<string | null>(null);
    return (
        <FilterInput
            filter={{
                type: 'select',
                label: 'Status',
                options: OPTIONS,
                value,
                onChange: setValue,
                ...extra,
            }}
        />
    );
};

const MultiSelectDemo = () => {
    const [value, setValue] = useState<string[] | null>(null);
    return (
        <FilterInput
            filter={{
                type: 'multiselect',
                label: 'Status',
                options: OPTIONS,
                value,
                onChange: setValue,
            }}
        />
    );
};

const TextDemo = () => {
    const [value, setValue] = useState<string | null>(null);
    return (
        <FilterInput
            filter={{ type: 'text', label: 'Name', value, onChange: setValue }}
        />
    );
};

const DateDemo = ({ mode }: { mode?: 'single' }) => {
    const [value, setValue] =
        useState<Extract<Filter, { type: 'date' }>['value']>(null);
    return (
        <FilterInput
            filter={{
                type: 'date',
                label: 'Created',
                mode,
                value,
                onChange: setValue,
            }}
        />
    );
};

const NumberRangeDemo = () => {
    const [value, setValue] = useState<
        Extract<Filter, { type: 'number-range' }>['value']
    >({ from: 10, to: 200 });
    return (
        <FilterInput
            filter={{
                type: 'number-range',
                label: 'Seats',
                min: 0,
                max: 500,
                value,
                onChange: setValue,
            }}
        />
    );
};

const meta: Meta<typeof FilterInput> = {
    title: 'UI/FilterInput',
    component: FilterInput,
    tags: ['autodocs'],
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
type Story = StoryObj<typeof FilterInput>;

export const Select: Story = { render: () => <SelectDemo /> };

export const SearchableSelect: Story = {
    render: () => <SelectDemo searchable />,
};

export const LoadingSelect: Story = {
    render: () => <SelectDemo options={[]} isPending />,
};

export const MultiSelect: Story = { render: () => <MultiSelectDemo /> };

export const Text: Story = { render: () => <TextDemo /> };

export const DateRange: Story = { render: () => <DateDemo /> };

export const SingleDate: Story = { render: () => <DateDemo mode="single" /> };

export const NumberRange: Story = { render: () => <NumberRangeDemo /> };
