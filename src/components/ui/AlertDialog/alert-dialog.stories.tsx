import { Button } from '@/components/ui/Button';
import { Trash2, AlertTriangle, ShieldAlert, LogOut, Info } from 'lucide-react';
import AlertDialogGroup from '.';
import { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof AlertDialogGroup> = {
    title: 'UI/AlertDialog',
    component: AlertDialogGroup,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AlertDialogGroup>;


export const Default: Story = {
    args: {
        trigger: <Button variant='outline'>Open Dialog</Button>,
        title: 'Are you absolutely sure?',
        description:
            'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
    },
};

export const Destructive: Story = {
    args: {
        trigger: <Button variant='destructive'>Delete Account</Button>,
        title: 'Delete Account',
        description:
            'This action cannot be undone. This will permanently delete your account and remove all associated data.',
        actionText: 'Delete Account',
        actionProps: { variant: 'destructive' },
    },
};

export const WithMedia: Story = {
    args: {
        trigger: <Button variant='outline'>Delete Item</Button>,
        title: 'Delete Item',
        description:
            'Are you sure you want to delete this item? This action cannot be undone.',
        media: <Trash2 />,
        actionText: 'Delete',
        actionProps: { variant: 'destructive' },
    },
};

export const WithWarningMedia: Story = {
    args: {
        trigger: (
            <Button variant='outline'>
                <LogOut />
                Sign Out
            </Button>
        ),
        title: 'Sign Out',
        description:
            'You will be signed out of your account. Any unsaved changes will be lost.',
        media: <Info />,
        actionText: 'Sign Out',
        cancelText: 'Stay',
    },
};

export const SmallSize: Story = {
    args: {
        trigger: (
            <Button variant='outline' size='sm'>
                Confirm Action
            </Button>
        ),
        title: 'Confirm Action',
        description: 'Are you sure you want to proceed with this action?',
        contentProps: { size: 'sm' },
    },
};

export const SmallSizeWithMedia: Story = {
    args: {
        trigger: (
            <Button variant='destructive'>
                <ShieldAlert />
                Revoke Access
            </Button>
        ),
        title: 'Revoke Access',
        description: 'This user will immediately lose access to all resources.',
        media: <AlertTriangle />,
        contentProps: { size: 'sm' },
        actionText: 'Revoke',
        actionProps: { variant: 'destructive' },
    },
};

export const SecondaryAction: Story = {
    args: {
        trigger: (
            <Button variant='outline' size='sm'>
                Secondary Action
            </Button>
        ),
        title: 'Secondary Action',
        description: 'This dialog uses a secondary action button variant.',
        actionText: 'Confirm',
        actionProps: { variant: 'secondary' },
    },
};

export const CustomActionVariants: Story = {
    render: () => (
        <div className='flex items-center gap-3'>
            <AlertDialogGroup
                trigger={
                    <Button variant='outline' size='sm'>
                        Secondary Action
                    </Button>
                }
                title='Secondary Action'
                description='This dialog uses a secondary action button variant.'
                actionText='Confirm'
                actionProps={{ variant: 'secondary' }}
            />
            <AlertDialogGroup
                trigger={
                    <Button variant='destructive' size='sm'>
                        Destructive Action
                    </Button>
                }
                title='Destructive Action'
                description='This action is irreversible. Please confirm you want to continue.'
                actionText='Delete'
                actionProps={{ variant: 'destructive' }}
            />
        </div>
    ),
};

