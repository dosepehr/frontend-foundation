import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import SearchInput from '.';

const meta: Meta<typeof SearchInput> = {
    title: 'UI/SearchInput',
    component: SearchInput,
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
        debounceMs: { control: 'number' },
        isLoading: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {};

export const WithLabel: Story = {
    args: { label: 'Find a user', description: 'Search by name or email.' },
};

export const WithValue: Story = {
    args: { defaultValue: 'Ada Lovelace' },
};

export const Loading: Story = {
    args: { defaultValue: 'Ada', isLoading: true },
};

export const Disabled: Story = {
    args: { defaultValue: 'Ada', disabled: true },
};

const FRUITS = [
    'Apple',
    'Apricot',
    'Banana',
    'Blueberry',
    'Cherry',
    'Grape',
    'Mango',
    'Orange',
    'Peach',
    'Pear',
];

const DebouncedDemo = () => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searches, setSearches] = useState(0);
    const results = FRUITS.filter((fruit) =>
        fruit.toLowerCase().includes(query.toLowerCase()),
    );

    return (
        <div className="flex flex-col gap-3">
            <SearchInput
                label="Fruits"
                description="Results update 500ms after you stop typing."
                debounceMs={500}
                isLoading={isLoading}
                onValueChange={() => setIsLoading(true)}
                onSearch={(value) => {
                    setQuery(value);
                    setIsLoading(false);
                    setSearches((count) => count + 1);
                }}
            />
            <p className="text-xs text-muted-foreground">
                Searches run: {searches}
            </p>
            <ul className="text-sm">
                {results.map((fruit) => (
                    <li key={fruit}>{fruit}</li>
                ))}
            </ul>
        </div>
    );
};

export const Debounced: Story = {
    render: () => <DebouncedDemo />,
};

export const RightToLeft: Story = {
    // Persian page: lang sets the Estedad font, dir the direction (also for portals).
    globals: { i18n: 'fa-IR' },
    render: (args) => (
        <div dir="rtl">
            <SearchInput {...args} />
        </div>
    ),
    args: { placeholder: 'جستجو', defaultValue: 'کتاب' },
};
