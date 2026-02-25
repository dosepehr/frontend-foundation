import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HomeIcon, FileTextIcon, FolderIcon } from 'lucide-react';
import BreadcrumbGroup from '.';
import type { BreadcrumbItemDef } from './breadcrumb.props';

const meta: Meta<typeof BreadcrumbGroup> = {
    title: 'Components/BreadcrumbGroup',
    component: BreadcrumbGroup,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        maxItems: {
            control: { type: 'number', min: 2 },
            description:
                'Maximum number of items to display (excess items are replaced with an ellipsis)',
        },
        separator: {
            control: false,
            description: 'Custom separator rendered between breadcrumb items',
        },
        items: {
            control: false,
            description: 'Array of breadcrumb items to render',
        },
    },
};

export default meta;
type Story = StoryObj<typeof BreadcrumbGroup>;

const threeItems: BreadcrumbItemDef[] = [
    { label: 'Home', href: '#' },
    { label: 'Components', href: '#' },
    { label: 'Breadcrumb' },
];

const sixItems: BreadcrumbItemDef[] = [
    { label: 'Home', href: '#' },
    { label: 'Dashboard', href: '#' },
    { label: 'Projects', href: '#' },
    { label: 'Design System', href: '#' },
    { label: 'Components', href: '#' },
    { label: 'Breadcrumb' },
];

const withIconItems: BreadcrumbItemDef[] = [
    { label: 'Home', href: '#', icon: HomeIcon },
    { label: 'Projects', href: '#', icon: FolderIcon },
    { label: 'Report.pdf', icon: FileTextIcon },
];

export const Default: Story = {
    args: {
        items: threeItems,
    },
};

export const WithIcons: Story = {
    args: {
        items: withIconItems,
    },
};

export const CollapsedMaxThree: Story = {
    args: {
        items: sixItems,
        maxItems: 3,
    },
};

export const CustomSeparatorText: Story = {
    name: 'Custom Separator — Text /',
    args: {
        items: threeItems,
        separator: <span className='text-xs text-muted-foreground'>/</span>,
    },
};

