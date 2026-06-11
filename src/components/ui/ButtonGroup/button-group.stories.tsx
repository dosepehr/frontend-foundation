import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
    AlignLeftIcon,
    AlignCenterIcon,
    AlignRightIcon,
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    CopyIcon,
    ScissorsIcon,
    ClipboardIcon,
} from 'lucide-react';
import ButtonGroupWrapper from '.';

const meta: Meta<typeof ButtonGroupWrapper> = {
    title: 'UI/ButtonGroup',
    component: ButtonGroupWrapper,
    tags: ['autodocs'],
    argTypes: {
        orientation: {
            control: 'radio',
            options: ['horizontal', 'vertical'],
            description: 'Direction the buttons are stacked',
        },
        separator: {
            control: 'boolean',
            description: 'Show a separator line between buttons',
        },
        items: {
            control: 'object',
            description: 'Array of button props',
        },
    },
};

export default meta;
type Story = StoryObj<typeof ButtonGroupWrapper>;

export const Default: Story = {
    args: {
        items: [
            { children: 'Back', variant: 'outline' },
            { children: 'Continue', variant: 'outline' },
            { children: 'Submit', variant: 'outline' },
        ],
    },
};

export const WithSeparator: Story = {
    args: {
        separator: true,
        items: [
            { children: 'Back', variant: 'outline' },
            { children: 'Continue', variant: 'outline' },
            { children: 'Submit', variant: 'outline' },
        ],
    },
};

export const Vertical: Story = {
    args: {
        orientation: 'vertical',
        items: [
            { children: 'Top', variant: 'outline' },
            { children: 'Middle', variant: 'outline' },
            { children: 'Bottom', variant: 'outline' },
        ],
    },
};

export const VerticalWithSeparator: Story = {
    args: {
        orientation: 'vertical',
        separator: true,
        items: [
            { children: 'Top', variant: 'outline' },
            { children: 'Middle', variant: 'outline' },
            { children: 'Bottom', variant: 'outline' },
        ],
    },
};

export const IconGroup: Story = {
    args: {
        items: [
            { children: <AlignLeftIcon />, variant: 'outline', size: 'icon' },
            { children: <AlignCenterIcon />, variant: 'outline', size: 'icon' },
            { children: <AlignRightIcon />, variant: 'outline', size: 'icon' },
        ],
    },
};

export const MixedVariants: Story = {
    args: {
        items: [
            { children: 'Cancel', variant: 'outline' },
            { children: 'Save Draft', variant: 'secondary' },
            { children: 'Publish', variant: 'default' },
        ],
    },
};

export const FormatToolbar: Story = {
    args: {
        separator: true,
        items: [
            { children: <BoldIcon />, variant: 'outline', size: 'icon' },
            { children: <ItalicIcon />, variant: 'outline', size: 'icon' },
            { children: <UnderlineIcon />, variant: 'outline', size: 'icon' },
        ],
    },
};

export const ClipboardGroup: Story = {
    args: {
        items: [
            {
                children: (
                    <>
                        <CopyIcon />
                        Copy
                    </>
                ),
                variant: 'outline',
            },
            {
                children: (
                    <>
                        <ScissorsIcon />
                        Cut
                    </>
                ),
                variant: 'outline',
            },
            {
                children: (
                    <>
                        <ClipboardIcon />
                        Paste
                    </>
                ),
                variant: 'outline',
            },
        ],
    },
};

export const SmallSize: Story = {
    args: {
        items: [
            { children: 'First', variant: 'outline', size: 'sm' },
            { children: 'Second', variant: 'outline', size: 'sm' },
            { children: 'Third', variant: 'outline', size: 'sm' },
        ],
    },
};

