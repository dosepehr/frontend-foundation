import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AlertWrapper from '.';
import type { AlertVariant } from './alert.types';

const meta: Meta<typeof AlertWrapper> = {
    title: 'UI/Alert',
    component: AlertWrapper,
    tags: ['autodocs'],
    argTypes: {
        title: {
            control: 'text',
            description: 'Alert title rendered in the header',
        },
        children: {
            control: 'text',
            description: 'Alert description content',
        },
        variant: {
            control: 'select',
            options: [
                'default',
                'info',
                'success',
                'warning',
                'destructive',
            ] satisfies AlertVariant[],
            description: 'Visual style and icon of the alert',
        },
    },
};

export default meta;
type Story = StoryObj<typeof AlertWrapper>;

export const Default: Story = {
    args: {
        variant: 'default',
        title: 'Heads up!',
        children: 'You can add components to your app using the CLI.',
    },
};

export const Info: Story = {
    args: {
        variant: 'info',
        title: 'Information',
        children: 'This action will affect all users in your organization.',
    },
};

export const Success: Story = {
    args: {
        variant: 'success',
        title: 'Success',
        children: 'Your changes have been saved successfully.',
    },
};

export const Warning: Story = {
    args: {
        variant: 'warning',
        title: 'Warning',
        children:
            'This operation cannot be undone. Please proceed with caution.',
    },
};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
        title: 'Error',
        children: 'Your session has expired. Please log in again.',
    },
};

export const WithoutTitle: Story = {
    args: {
        variant: 'info',
        children: 'A simple alert without a title.',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex w-full max-w-lg flex-col gap-3">
            {(
                [
                    'default',
                    'info',
                    'success',
                    'warning',
                    'destructive',
                ] satisfies AlertVariant[]
            ).map((variant) => (
                <AlertWrapper
                    key={variant}
                    variant={variant}
                    title={variant.charAt(0).toUpperCase() + variant.slice(1)}
                >
                    This is a {variant} alert message.
                </AlertWrapper>
            ))}
        </div>
    ),
    args: {},
};
