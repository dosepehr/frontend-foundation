import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import TreeSelect from '.';
import type { TreeSelectProps } from './TreeSelect.types';
import type { TreeOption } from './utils/tree/tree';

const CATEGORIES: TreeOption[] = [
    {
        value: 'electronics',
        label: 'Electronics',
        children: [
            {
                value: 'computers',
                label: 'Computers',
                children: [
                    { value: 'laptops', label: 'Laptops' },
                    { value: 'desktops', label: 'Desktops' },
                    { value: 'tablets', label: 'Tablets' },
                ],
            },
            {
                value: 'phones',
                label: 'Phones',
                children: [
                    { value: 'android', label: 'Android' },
                    { value: 'ios', label: 'iOS' },
                ],
            },
            { value: 'cameras', label: 'Cameras', disabled: true },
        ],
    },
    {
        value: 'home',
        label: 'Home & Kitchen',
        children: [
            { value: 'furniture', label: 'Furniture' },
            { value: 'cookware', label: 'Cookware' },
        ],
    },
    { value: 'books', label: 'Books' },
];

const Controlled = (props: TreeSelectProps) => {
    const [selected, setSelected] = useState(props.selected);
    return (
        <div className="flex flex-col gap-2">
            <TreeSelect {...props} selected={selected} onChange={setSelected} />
            <p className="text-sm text-muted-foreground">
                Value: <code>{JSON.stringify(selected)}</code>
            </p>
        </div>
    );
};

const meta: Meta<typeof TreeSelect> = {
    title: 'UI/TreeSelect',
    component: TreeSelect,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
    render: (args) => <Controlled {...args} />,
    argTypes: {
        label: { control: 'text' },
        description: { control: 'text' },
        error: { control: 'text' },
        multiple: { control: 'boolean' },
        hideSelectedBadges: { control: 'boolean' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
    },
    args: {
        options: CATEGORIES,
        selected: [],
        label: 'Categories',
        placeholder: 'Select the categories',
    },
};

export default meta;
type Story = StoryObj<typeof TreeSelect>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const body = within(canvasElement.ownerDocument.body);
        await userEvent.click(canvas.getByRole('button', { expanded: false }));
        const content = await body.findByRole('tree');
        // Wait for the open animation to finish.
        await waitFor(() => expect(content).toBeVisible());
    },
};

export const WithSelection: Story = {
    args: {
        selected: ['laptops', 'android', 'books'],
        defaultExpanded: ['electronics'],
    },
};

export const ExpandedByDefault: Story = {
    args: { defaultExpanded: 'all' },
};

export const SingleSelect: Story = {
    args: {
        multiple: false,
        label: 'Category',
        placeholder: 'Select the category',
        description: 'Click a group to open it, then pick one item.',
    },
};

export const WithoutBadges: Story = {
    args: { hideSelectedBadges: true, selected: ['furniture', 'cookware'] },
};

export const Loading: Story = {
    args: { options: [], isPending: true },
};

export const LoadError: Story = {
    args: { options: [], isError: true },
};

const ServerDemo = () => {
    const [options, setOptions] = useState<TreeOption[]>([]);
    const [isPending, setIsPending] = useState(true);
    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOptions(CATEGORIES);
            setIsPending(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <TreeSelect
            label="Categories"
            description="The options load from the server after 1.5 seconds."
            options={options}
            isPending={isPending}
            selected={selected}
            onChange={setSelected}
        />
    );
};

export const FromServer: Story = {
    render: () => <ServerDemo />,
};

export const Invalid: Story = {
    args: { error: 'Choose at least one category.', required: true },
};

export const Disabled: Story = {
    args: { disabled: true, selected: ['books'] },
};

export const RightToLeft: Story = {
    // Persian page: lang sets the Estedad font, dir the direction (also for portals).
    globals: { i18n: 'fa-IR' },
    render: (args) => (
        <div dir="rtl">
            <Controlled {...args} />
        </div>
    ),
    args: {
        label: 'دسته‌بندی',
        placeholder: 'دسته‌بندی را انتخاب کنید',
        searchPlaceholder: 'جستجو',
        notFoundText: 'نتیجه‌ای یافت نشد.',
        defaultExpanded: 'all',
        options: [
            {
                value: 'digital',
                label: 'کالای دیجیتال',
                children: [
                    { value: 'mobile', label: 'موبایل' },
                    { value: 'laptop', label: 'لپ‌تاپ' },
                ],
            },
            { value: 'book', label: 'کتاب' },
        ],
    },
};
