import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
    AlignCenterIcon,
    AlignJustifyIcon,
    AlignLeftIcon,
    AlignRightIcon,
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
} from 'lucide-react';
import ToggleGroupWrapper from '.';

const meta: Meta<typeof ToggleGroupWrapper> = {
    title: 'UI/ToggleGroup',
    component: ToggleGroupWrapper,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: [
                'default',
                'outline',
                'primary',
                'success',
                'warning',
                'destructive',
                'info',
            ],
            description: 'Visual style applied to all items',
        },
        size: {
            control: 'radio',
            options: ['sm', 'default', 'lg'],
            description: 'Size applied to all items',
        },
        type: {
            control: 'radio',
            options: ['single', 'multiple'],
            description: 'Single or multiple selection',
        },
        orientation: {
            control: 'radio',
            options: ['horizontal', 'vertical'],
            description: 'Direction of the group',
        },
        spacing: {
            control: 'number',
            description: 'Gap between items — 0 joins them together',
        },
        items: {
            control: 'object',
            description:
                'Array of item props (all ToggleGroupItem props + label)',
        },
    },
};

export default meta;
type Story = StoryObj<typeof ToggleGroupWrapper>;

export const Default: Story = {
    args: {
        type: 'single',
        defaultValue: 'md',
        variant: 'default',
        items: [
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
        ],
    },
};

export const Outline: Story = {
    args: {
        type: 'single',
        defaultValue: 'md',
        variant: 'outline',
        spacing: 0,
        items: [
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
        ],
    },
};

export const WithIcons: Story = {
    args: {
        type: 'single',
        defaultValue: 'center',
        variant: 'outline',
        spacing: 0,
        items: [
            { value: 'left', label: <AlignLeftIcon /> },
            { value: 'center', label: <AlignCenterIcon /> },
            { value: 'right', label: <AlignRightIcon /> },
            { value: 'justify', label: <AlignJustifyIcon /> },
        ],
    },
};

export const Multiple: Story = {
    args: {
        type: 'multiple',
        defaultValue: ['bold', 'underline'],
        variant: 'outline',
        spacing: 0,
        items: [
            { value: 'bold', label: <BoldIcon /> },
            { value: 'italic', label: <ItalicIcon /> },
            { value: 'underline', label: <UnderlineIcon /> },
        ],
    },
};

export const WithDisabledItem: Story = {
    args: {
        type: 'single',
        defaultValue: 'a',
        variant: 'outline',
        spacing: 0,
        items: [
            { value: 'a', label: 'Available' },
            { value: 'b', label: 'Disabled', disabled: true },
            { value: 'c', label: 'Available' },
        ],
    },
};

export const Vertical: Story = {
    args: {
        type: 'single',
        defaultValue: 'b',
        variant: 'outline',
        orientation: 'vertical',
        spacing: 0,
        items: [
            { value: 'a', label: 'Option A' },
            { value: 'b', label: 'Option B' },
            { value: 'c', label: 'Option C' },
        ],
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            {(
                [
                    'default',
                    'outline',
                    'primary',
                    'success',
                    'warning',
                    'destructive',
                    'info',
                ] as const
            ).map((variant) => (
                <ToggleGroupWrapper
                    key={variant}
                    type="single"
                    defaultValue="a"
                    variant={variant}
                    spacing={0}
                    items={[
                        { value: 'a', label: 'Option A' },
                        { value: 'b', label: 'Option B' },
                        { value: 'c', label: 'Option C' },
                    ]}
                />
            ))}
        </div>
    ),
    args: {},
};

export const AllSizes: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            {(['sm', 'default', 'lg'] as const).map((size) => (
                <ToggleGroupWrapper
                    key={size}
                    type="single"
                    defaultValue="a"
                    variant="outline"
                    size={size}
                    spacing={0}
                    items={[
                        { value: 'a', label: 'Option A' },
                        { value: 'b', label: 'Option B' },
                        { value: 'c', label: 'Option C' },
                    ]}
                />
            ))}
        </div>
    ),
    args: {},
};
