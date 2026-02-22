import { Meta, StoryObj } from '@storybook/nextjs-vite';
import AlertGroup from '.';
import { LucideIcon } from 'lucide-react';

type Story = StoryObj<typeof AlertGroup>;

const meta: Meta<typeof AlertGroup> = {
    title: 'components/Alert',
    component: AlertGroup,
    tags: ['autodocs'],
};

export default meta;

export const Default: Story = {
    render: () => (
        <AlertGroup variant='info' title='Heads up'>
            You can change your settings in the profile page.
        </AlertGroup>
    ),
};

export const Info: Story = {
    render: () => (
        <AlertGroup variant='info' title='Information'>
            Your account will be reviewed within 24 hours.
        </AlertGroup>
    ),
};

export const Success: Story = {
    render: () => (
        <AlertGroup variant='success' title='Success'>
            Your changes have been saved successfully.
        </AlertGroup>
    ),
};

export const Warning: Story = {
    render: () => (
        <AlertGroup variant='warning' title='Warning'>
            Your subscription is about to expire in 3 days.
        </AlertGroup>
    ),
};

export const Destructive: Story = {
    render: () => (
        <AlertGroup variant='destructive' title='Error'>
            Failed to process your request. Please try again.
        </AlertGroup>
    ),
};

export const WithoutTitle: Story = {
    render: () => (
        <AlertGroup variant='info' >
            This alert has no title, only a description.
        </AlertGroup>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className='flex flex-col gap-4 w-full'>
            <AlertGroup variant='default' title='Default'>
                This is a default alert message.
            </AlertGroup>
            <AlertGroup variant='info' title='Info'>
                This is an informational alert message.
            </AlertGroup>
            <AlertGroup variant='success' title='Success'>
                This is a success alert message.
            </AlertGroup>
            <AlertGroup variant='warning' title='Warning'>
                This is a warning alert message.
            </AlertGroup>
            <AlertGroup variant='destructive' title='Destructive'>
                This is a destructive alert message.
            </AlertGroup>
        </div>
    ),
};

