import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
    AlertTriangleIcon,
    BluetoothIcon,
    CheckCircleIcon,
    CircleFadingPlusIcon,
    InfoIcon,
    Trash2Icon,
} from 'lucide-react';
import AlertDialogWrapper from '.';
import { Button } from '../Button/components';
import type { AlertDialogIntent } from './alert-dialog.types';

const meta: Meta<typeof AlertDialogWrapper> = {
    title: 'UI/AlertDialog',
    component: AlertDialogWrapper,
    tags: ['autodocs'],
    argTypes: {
        title: {
            control: 'text',
            description: 'Dialog title',
        },
        description: {
            control: 'text',
            description: 'Dialog description',
        },
        intent: {
            control: 'select',
            options: [
                'default',
                'destructive',
                'warning',
                'info',
                'success',
            ] satisfies AlertDialogIntent[],
            description:
                'Sets media color scheme and default action button variant',
        },
        confirmLabel: {
            control: 'text',
            description: 'Label for the confirm action button',
        },
        cancelLabel: {
            control: 'text',
            description: 'Label for the cancel button',
        },
        size: {
            control: 'radio',
            options: ['default', 'sm'],
            description: 'Size of the dialog content',
        },
        mediaClassName: {
            control: 'text',
            description: 'Overrides the intent media class names',
        },
        actionProps: {
            control: 'object',
            description: 'Props passed to the action button',
        },
        cancelProps: {
            control: 'object',
            description: 'Props passed to the cancel button',
        },
    },
};

export default meta;
type Story = StoryObj<typeof AlertDialogWrapper>;

export const Basic: Story = {
    args: {
        trigger: <Button variant="outline">Show Dialog</Button>,
        title: 'Are you absolutely sure?',
        description:
            'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
        confirmLabel: 'Continue',
        cancelLabel: 'Cancel',
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        trigger: <Button variant="outline">Show Dialog</Button>,
        title: 'Allow accessory to connect?',
        description:
            'Do you want to allow the USB accessory to connect to this device?',
        confirmLabel: 'Allow',
        cancelLabel: "Don't allow",
    },
};

export const WithMedia: Story = {
    args: {
        trigger: <Button variant="outline">Share Project</Button>,
        title: 'Share this project?',
        description:
            'Anyone with the link will be able to view and edit this project.',
        media: <CircleFadingPlusIcon />,
        confirmLabel: 'Share',
        cancelLabel: 'Cancel',
    },
};

export const SmallWithMedia: Story = {
    args: {
        size: 'sm',
        trigger: <Button variant="outline">Show Dialog</Button>,
        title: 'Allow accessory to connect?',
        description:
            'Do you want to allow the USB accessory to connect to this device?',
        media: <BluetoothIcon />,
        confirmLabel: 'Allow',
        cancelLabel: "Don't allow",
    },
};

export const Destructive: Story = {
    args: {
        size: 'sm',
        intent: 'destructive',
        trigger: <Button variant="destructive">Delete Chat</Button>,
        title: 'Delete chat?',
        description: 'This will permanently delete this chat conversation.',
        media: <Trash2Icon />,
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
    },
};

export const Warning: Story = {
    args: {
        size: 'sm',
        intent: 'warning',
        trigger: <Button variant="outline">Show Warning</Button>,
        title: 'Unsaved changes',
        description:
            'You have unsaved changes that will be lost. Are you sure you want to continue?',
        media: <AlertTriangleIcon />,
        confirmLabel: 'Discard',
        cancelLabel: 'Keep editing',
    },
};

export const Info: Story = {
    args: {
        size: 'sm',
        intent: 'info',
        trigger: <Button variant="outline">Show Info</Button>,
        title: 'New update available',
        description:
            'A new version is available. Restart the app to apply the latest updates.',
        media: <InfoIcon />,
        confirmLabel: 'Restart now',
        cancelLabel: 'Later',
    },
};

export const Success: Story = {
    args: {
        size: 'sm',
        intent: 'success',
        trigger: <Button variant="outline">Confirm</Button>,
        title: 'Payment successful',
        description:
            'Your payment has been processed. A receipt has been sent to your email.',
        media: <CheckCircleIcon />,
        confirmLabel: 'Done',
        cancelLabel: 'View receipt',
    },
};
