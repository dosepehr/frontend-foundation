import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Book, Inbox, Plus } from 'lucide-react';
import { Button } from '../Button';
import EmptyGroup from '.';
import AvatarGroup from '../Avatar';
import { AvatarItem } from '../Avatar/avatar.props';

const sampleAvatars: AvatarItem[] = [
    {
        src: 'https://i.pravatar.cc/150?img=1',
        fallback: 'AL',
        alt: 'Alice Lee',
    },
    {
        src: 'https://i.pravatar.cc/150?img=2',
        fallback: 'BM',
        alt: 'Bob Martin',
    },
    {
        src: 'https://i.pravatar.cc/150?img=3',
        fallback: 'CR',
        alt: 'Clara Reed',
    },
    {
        src: 'https://i.pravatar.cc/150?img=4',
        fallback: 'DK',
        alt: 'David Kim',
    },
    { src: 'https://i.pravatar.cc/150?img=5', fallback: 'EN', alt: 'Eva Nash' },
];

const meta: Meta<typeof EmptyGroup> = {
    title: 'Components/Empty',
    component: EmptyGroup,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        title: {
            control: 'text',
            description: 'The main heading displayed in the empty state.',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'No data' },
            },
        },
        description: {
            control: 'text',
            description: 'A short supporting text displayed below the title.',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'No data found' },
            },
        },
        mediaVariant: {
            control: 'radio',
            options: ['icon', 'default'],
            description:
                'Controls how the media element is displayed. Use "icon" for small symbolic icons and "default" for larger visuals such as avatars or images.',
            table: {
                type: { summary: "'icon' | 'default'" },
                defaultValue: { summary: 'icon' },
            },
        },
        media: {
            control: false,
            description:
                'A React node rendered as the visual media. Accepts any element: a Lucide icon, an avatar group, an illustration, etc.',
            table: {
                type: { summary: 'ReactNode' },
            },
        },
        children: {
            control: false,
            description:
                'Action area rendered below the header. Typically contains one or more buttons.',
            table: {
                type: { summary: 'ReactNode' },
            },
        },
    },
    args: {
        title: 'No data',
        description: 'No data found',
        mediaVariant: 'icon',
    },
};

export default meta;
type Story = StoryObj<typeof EmptyGroup>;

export const Default: Story = {
    args: {
        media: <Book />,
        title: 'No data',
        description: 'No data found',
        mediaVariant: 'icon',
        children: <Button>Add data</Button>,
    },
};

export const WithMultipleActions: Story = {
    name: 'Multiple Actions',
    args: {
        media: <Book />,
        title: 'No books yet',
        description:
            'Start by adding your first book or import an existing collection.',
        mediaVariant: 'icon',
        children: (
            <div className='flex gap-2'>
                <Button variant='outline'>Import</Button>
                <Button>
                    <Plus />
                    Add book
                </Button>
            </div>
        ),
    },
};

export const NoMedia: Story = {
    name: 'Without Media',
    args: {
        media: undefined,
        title: 'Nothing here yet',
        description: 'Get started by creating your first item.',
        children: <Button>Get started</Button>,
    },
};

export const NoActions: Story = {
    name: 'Without Actions',
    args: {
        media: <Inbox />,
        title: 'All caught up!',
        description: 'You have no pending tasks.',
        children: null,
    },
};

export const WithAvatarMedia: Story = {
    name: 'With Avatar Group as Media',
    args: {
        title: 'No team members',
        description:
            'Invite your colleagues to collaborate on this project together.',
        mediaVariant: 'default',
        children: (
            <div className='flex gap-2'>
                <Button variant='outline'>Learn more</Button>
                <Button>
                    <Plus />
                    Invite members
                </Button>
            </div>
        ),
    },
    render: (args) => (
        <EmptyGroup
            {...args}
            media={<AvatarGroup avatars={sampleAvatars} max={4} size='lg' />}
        />
    ),
};

