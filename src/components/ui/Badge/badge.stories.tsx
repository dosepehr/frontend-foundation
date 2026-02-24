import { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
    InfoIcon,
    CheckCircleIcon,
    AlertTriangleIcon,
    XCircleIcon,
    StarIcon,
    BellIcon,
} from 'lucide-react';
import { Badge } from '.';

const meta: Meta<typeof Badge> = {
    title: 'Components/Badge',
    component: Badge,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        variant: {
            control: 'select',
            options: [
                'default',
                'secondary',
                'destructive',
                'outline',
                'ghost',
                'link',
                'info',
                'success',
                'warning',
            ],
        },
        asChild: {
            control: 'boolean',
        },
    },
    args: {
        variant: 'default',
        children: 'Badge',
    },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
    args: {
        variant: 'default',
        children: 'Default',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary',
    },
};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
        children: 'Destructive',
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
        children: 'Outline',
    },
};

export const Ghost: Story = {
    args: {
        variant: 'ghost',
        children: 'Ghost',
    },
};

export const Link: Story = {
    args: {
        variant: 'link',
        children: 'Link',
    },
};

export const Info: Story = {
    args: {
        variant: 'info',
        children: 'Info',
    },
};

export const Success: Story = {
    args: {
        variant: 'success',
        children: 'Success',
    },
};

export const Warning: Story = {
    args: {
        variant: 'warning',
        children: 'Warning',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className='flex flex-wrap items-center gap-3'>
            <Badge variant='default'>Default</Badge>
            <Badge variant='secondary'>Secondary</Badge>
            <Badge variant='destructive'>Destructive</Badge>
            <Badge variant='outline'>Outline</Badge>
            <Badge variant='ghost'>Ghost</Badge>
            <Badge variant='link'>Link</Badge>
            <Badge variant='info'>Info</Badge>
            <Badge variant='success'>Success</Badge>
            <Badge variant='warning'>Warning</Badge>
        </div>
    ),
};

export const WithLeadingIcon: Story = {
    render: () => (
        <div className='flex flex-wrap items-center gap-3'>
            <Badge variant='default'>
                <StarIcon data-icon='inline-start' />
                Default
            </Badge>
            <Badge variant='info'>
                <InfoIcon data-icon='inline-start' />
                Info
            </Badge>
            <Badge variant='success'>
                <CheckCircleIcon data-icon='inline-start' />
                Success
            </Badge>
            <Badge variant='warning'>
                <AlertTriangleIcon data-icon='inline-start' />
                Warning
            </Badge>
            <Badge variant='destructive'>
                <XCircleIcon data-icon='inline-start' />
                Destructive
            </Badge>
        </div>
    ),
};

export const WithTrailingIcon: Story = {
    render: () => (
        <div className='flex flex-wrap items-center gap-3'>
            <Badge variant='default'>
                Default
                <StarIcon data-icon='inline-end' />
            </Badge>
            <Badge variant='info'>
                Info
                <InfoIcon data-icon='inline-end' />
            </Badge>
            <Badge variant='success'>
                Success
                <CheckCircleIcon data-icon='inline-end' />
            </Badge>
            <Badge variant='warning'>
                Warning
                <AlertTriangleIcon data-icon='inline-end' />
            </Badge>
            <Badge variant='destructive'>
                Destructive
                <XCircleIcon data-icon='inline-end' />
            </Badge>
        </div>
    ),
};

export const IconOnly: Story = {
    render: () => (
        <div className='flex flex-wrap items-center gap-3'>
            <Badge variant='default'>
                <StarIcon />
            </Badge>
            <Badge variant='info'>
                <InfoIcon />
            </Badge>
            <Badge variant='success'>
                <CheckCircleIcon />
            </Badge>
            <Badge variant='warning'>
                <AlertTriangleIcon />
            </Badge>
            <Badge variant='destructive'>
                <XCircleIcon />
            </Badge>
            <Badge variant='secondary'>
                <BellIcon />
            </Badge>
        </div>
    ),
};

export const StatusBadges: Story = {
    render: () => (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-wrap items-center gap-3'>
                <Badge variant='success'>
                    <CheckCircleIcon data-icon='inline-start' />
                    Completed
                </Badge>
                <Badge variant='info'>
                    <InfoIcon data-icon='inline-start' />
                    In Progress
                </Badge>
                <Badge variant='warning'>
                    <AlertTriangleIcon data-icon='inline-start' />
                    Pending
                </Badge>
                <Badge variant='destructive'>
                    <XCircleIcon data-icon='inline-start' />
                    Failed
                </Badge>
            </div>
        </div>
    ),
};

export const AsChild: Story = {
    render: () => (
        <div className='flex flex-wrap items-center gap-3'>
            <Badge variant='default' asChild>
                <a href='#'>Clickable Default</a>
            </Badge>
            <Badge variant='info' asChild>
                <a href='#'>Clickable Info</a>
            </Badge>
            <Badge variant='success' asChild>
                <a href='#'>Clickable Success</a>
            </Badge>
            <Badge variant='outline' asChild>
                <a href='#'>Clickable Outline</a>
            </Badge>
        </div>
    ),
};

