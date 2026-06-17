import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';
import { FileTextIcon, LinkIcon, UserIcon } from 'lucide-react';
import DialogWrapper from '.';
import type { DialogMaxWidth } from './dialog.types';
import { Button } from '../Button/components';
import { Input } from '../Input';
import { Label } from '../Label';

const meta: Meta<typeof DialogWrapper> = {
    title: 'UI/Dialog',
    component: DialogWrapper,
    tags: ['autodocs'],
    argTypes: {
        title: { control: 'text', description: 'Dialog title' },
        description: { control: 'text', description: 'Dialog description' },
        cancelLabel: { control: 'text', description: 'Cancel button label' },
        maxWidth: {
            control: 'select',
            options: [
                'sm',
                'md',
                'lg',
                'xl',
                '2xl',
                '3xl',
                '4xl',
                '5xl',
                '6xl',
                '7xl',
            ] satisfies DialogMaxWidth[],
            description: 'Max width of the dialog',
        },
        showCloseIcon: {
            control: 'boolean',
            description: 'Show the × icon in the dialog header',
        },
        showCancelButton: {
            control: 'boolean',
            description: 'Show the cancel button in the dialog footer',
        },
    },
};

export default meta;
type Story = StoryObj<typeof DialogWrapper>;

export const Basic: Story = {
    args: {
        trigger: <Button variant='outline'>Open</Button>,
        title: 'Are you absolutely sure?',
        description:
            'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
        cancelLabel: 'Close',
    },
};

export const WithForm: Story = {
    args: {
        trigger: <Button variant='outline'>Edit Profile</Button>,
        title: 'Edit profile',
        description:
            "Make changes to your profile here. Click save when you're done.",
        footer: <Button type='submit'>Save changes</Button>,
        cancelLabel: 'Cancel',
    },
    render: (args) => (
        <DialogWrapper {...args}>
            <div className='grid gap-4'>
                <div className='grid gap-2'>
                    <Label htmlFor='dialog-name'>Name</Label>
                    <Input id='dialog-name' defaultValue='Pedro Duarte' />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='dialog-username'>Username</Label>
                    <Input id='dialog-username' defaultValue='@peduarte' />
                </div>
            </div>
        </DialogWrapper>
    ),
};

export const ShareLink: Story = {
    args: {
        trigger: <Button variant='outline'>Share</Button>,
        title: 'Share link',
        description: 'Anyone who has this link will be able to view this.',
        maxWidth: 'md',
        cancelLabel: 'Close',
    },
    render: (args) => (
        <DialogWrapper {...args}>
            <div className='flex items-center gap-2'>
                <div className='grid flex-1 gap-2'>
                    <Label htmlFor='dialog-link' className='sr-only'>
                        Link
                    </Label>
                    <Input
                        id='dialog-link'
                        defaultValue='https://ui.shadcn.com/docs/installation'
                        readOnly
                    />
                </div>
                <Button size='icon' variant='outline'>
                    <LinkIcon className='size-4' />
                    <span className='sr-only'>Copy link</span>
                </Button>
            </div>
        </DialogWrapper>
    ),
};

export const WithIcon: Story = {
    args: {
        trigger: <Button variant='outline'>View Document</Button>,
        title: 'Document details',
        description: 'Review the document information before proceeding.',
        icon: <FileTextIcon className='size-4' />,
        footer: <Button>Download</Button>,
        cancelLabel: 'Cancel',
    },
    render: (args) => (
        <DialogWrapper {...args}>
            <div className='rounded-md border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground'>
                <p>
                    <span className='font-medium text-foreground'>File:</span>{' '}
                    report-2024.pdf
                </p>
                <p>
                    <span className='font-medium text-foreground'>Size:</span>{' '}
                    2.4 MB
                </p>
                <p>
                    <span className='font-medium text-foreground'>
                        Uploaded:
                    </span>{' '}
                    June 12, 2024
                </p>
            </div>
        </DialogWrapper>
    ),
};

export const UserProfile: Story = {
    args: {
        trigger: <Button variant='outline'>View Profile</Button>,
        title: 'User profile',
        icon: <UserIcon className='size-4' />,
        maxWidth: 'sm',
        cancelLabel: 'Close',
    },
    render: (args) => (
        <DialogWrapper {...args}>
            <div className='flex flex-col items-center gap-3 py-2'>
                <div className='flex size-16 items-center justify-center rounded-full bg-primary/10'>
                    <UserIcon className='size-8 text-primary' />
                </div>
                <div className='text-center'>
                    <p className='font-medium'>Pedro Duarte</p>
                    <p className='text-sm text-muted-foreground'>@peduarte</p>
                </div>
                <div className='w-full rounded-md border border-border px-4 py-3 text-sm'>
                    <p className='text-muted-foreground'>
                        Member since Jan 2023
                    </p>
                </div>
            </div>
        </DialogWrapper>
    ),
};

export const LargeContent: Story = {
    args: {
        trigger: <Button variant='outline'>Terms of Service</Button>,
        title: 'Terms of Service',
        description: 'Please read our terms of service carefully.',
        maxWidth: '2xl',
        footer: <Button>Accept</Button>,
        cancelLabel: 'Decline',
    },
    render: (args) => (
        <DialogWrapper {...args}>
            <div className='max-h-64 overflow-y-auto rounded-md border border-border px-4 py-3 text-sm text-muted-foreground'>
                {Array.from({ length: 8 }).map((_, i) => (
                    <p key={i} className='mb-3 leading-relaxed'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat.
                    </p>
                ))}
            </div>
        </DialogWrapper>
    ),
};

export const TallContent: Story = {
    args: {
        trigger: <Button variant='outline'>Open Tall Dialog</Button>,
        title: 'Activity log',
        description: 'Recent actions taken on your account.',
        footer: <Button>Export</Button>,
        cancelLabel: 'Close',
        maxWidth: 'md',
    },
    render: (args) => (
        <DialogWrapper {...args}>
            <div className='flex flex-col gap-3 text-sm'>
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className='flex items-start gap-3 rounded-md border border-border px-3 py-2'
                    >
                        <div className='mt-0.5 size-2 shrink-0 rounded-full bg-primary' />
                        <div>
                            <p className='font-medium text-foreground'>
                                Action {i + 1}
                            </p>
                            <p className='text-muted-foreground'>
                                Lorem ipsum dolor sit amet consectetur.
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </DialogWrapper>
    ),
};

export const NoCancelButton: Story = {
    args: {
        trigger: <Button variant='outline'>Open</Button>,
        title: 'Session expired',
        description:
            'Your session has expired. Please log in again to continue.',
        maxWidth: 'sm',
        footer: <Button>Log in again</Button>,
        showCancelButton: false,
    },
};

export const NoCancelNoFooter: Story = {
    args: {
        trigger: <Button variant='outline'>Open</Button>,
        title: 'Keyboard shortcuts',
        description: 'Use these shortcuts to navigate the app faster.',
        maxWidth: 'sm',
        showCancelButton: false,
    },
    render: (args) => (
        <DialogWrapper {...args}>
            <div className='grid gap-2 text-sm'>
                {[
                    ['⌘ K', 'Open command palette'],
                    ['⌘ /', 'Toggle sidebar'],
                    ['⌘ S', 'Save changes'],
                    ['Esc', 'Close dialog'],
                ].map(([key, label]) => (
                    <div
                        key={key}
                        className='flex items-center justify-between rounded-md border border-border px-3 py-2'
                    >
                        <span className='text-muted-foreground'>{label}</span>
                        <kbd className='rounded bg-muted px-2 py-0.5 font-mono text-xs'>
                            {key}
                        </kbd>
                    </div>
                ))}
            </div>
        </DialogWrapper>
    ),
};

export const Controlled: Story = {
    render: () => {
        const [open, setOpen] = React.useState(false);
        const [saved, setSaved] = React.useState(false);

        const handleSave = () => {
            setSaved(true);
            setOpen(false);
        };

        return (
            <div className='flex flex-col items-center gap-4'>
                <Button
                    variant='outline'
                    onClick={() => {
                        setOpen(true);
                        setSaved(false);
                    }}
                >
                    Open controlled dialog
                </Button>
                {saved && (
                    <p className='text-sm text-success'>
                        Changes saved successfully.
                    </p>
                )}
                <DialogWrapper
                    open={open}
                    onOpenChange={setOpen}
                    title='Edit profile'
                    description="Make changes to your profile here. Click save when you're done."
                    footer={<Button onClick={handleSave}>Save changes</Button>}
                >
                    <div className='grid gap-4'>
                        <div className='grid gap-2'>
                            <Label htmlFor='ctrl-name'>Name</Label>
                            <Input id='ctrl-name' defaultValue='Pedro Duarte' />
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor='ctrl-username'>Username</Label>
                            <Input
                                id='ctrl-username'
                                defaultValue='@peduarte'
                            />
                        </div>
                    </div>
                </DialogWrapper>
            </div>
        );
    },
};

