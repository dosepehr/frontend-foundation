import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChevronRightIcon, HomeIcon, SlashIcon } from 'lucide-react';
import BreadcrumbWrapper from '.';

const meta: Meta<typeof BreadcrumbWrapper> = {
    title: 'UI/Breadcrumb',
    component: BreadcrumbWrapper,
    tags: ['autodocs'],
    argTypes: {
        items: {
            control: 'object',
            description:
                'Array of breadcrumb items with label and optional href',
        },
        separator: {
            control: false,
            description: 'Custom separator node — defaults to ChevronRight',
        },
        ellipsis: {
            control: 'boolean',
            description:
                'Collapse middle items into an ellipsis when over maxItems',
        },
        maxItems: {
            control: 'number',
            description:
                'Max visible items before collapsing (requires ellipsis: true)',
        },
    },
};

export default meta;
type Story = StoryObj<typeof BreadcrumbWrapper>;

const defaultItems = [
    { label: 'Home', href: '/' },
    { label: 'Components', href: '/components' },
    { label: 'Breadcrumb' },
];

export const Default: Story = {
    args: {
        items: defaultItems,
    },
};

export const TwoItems: Story = {
    args: {
        items: [{ label: 'Home', href: '/' }, { label: 'Dashboard' }],
    },
};

export const LongPath: Story = {
    args: {
        items: [
            { label: 'Home', href: '/' },
            { label: 'Settings', href: '/settings' },
            { label: 'Account', href: '/settings/account' },
            { label: 'Security', href: '/settings/account/security' },
            { label: 'Two-Factor Auth' },
        ],
    },
};

export const WithEllipsis: Story = {
    args: {
        items: [
            { label: 'Home', href: '/' },
            { label: 'Settings', href: '/settings' },
            { label: 'Account', href: '/settings/account' },
            { label: 'Security', href: '/settings/account/security' },
            { label: 'Two-Factor Auth' },
        ],
        ellipsis: true,
        maxItems: 3,
    },
};

export const SlashSeparator: Story = {
    args: {
        items: defaultItems,
        separator: <SlashIcon className="size-3.5" />,
    },
};

export const CustomSeparator: Story = {
    args: {
        items: defaultItems,
        separator: <ChevronRightIcon className="text-primary" />,
    },
};

export const WithHomeIcon: Story = {
    args: {
        items: [
            { label: <HomeIcon className="size-4" />, href: '/' },
            { label: 'Components', href: '/components' },
            { label: 'Breadcrumb' },
        ],
    },
};
