import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Image from 'next/image';
import { Book, Settings, Trash2 } from 'lucide-react';
import { Button } from '../Button';
import { Avatar, AvatarFallback, AvatarImage } from '../Avatar/components';
import { ItemList } from './item';
import ItemGroup from '.';

const meta: Meta<typeof ItemGroup> = {
    title: 'Components/Item',
    component: ItemGroup,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'A flexible list item component supporting icons, avatars, images, actions, and header/footer slots. Wrap multiple `ItemGroup` components inside `ItemList` to form a group.',
            },
        },
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'outline', 'muted'],
            description: 'Visual style of the item.',
        },
        size: {
            control: 'select',
            options: ['default', 'sm', 'xs'],
            description: 'Size of the item.',
        },
        title: {
            control: 'text',
            description: 'Primary label displayed in the item.',
        },
        description: {
            control: 'text',
            description: 'Secondary text displayed below the title.',
        },
        mediaVariant: {
            control: 'select',
            options: ['default', 'icon', 'image'],
            description: 'Controls how the media slot is styled.',
        },
    },
};

export default meta;
type Story = StoryObj<typeof ItemGroup>;

export const Default: Story = {
    args: {
        title: 'Getting Started',
        description: 'Learn the basics of the platform.',
        variant: 'default',
        size: 'default',
    },
};

export const WithIcon: Story = {
    args: {
        title: 'Getting Started',
        description: 'Learn the basics of the platform.',
        variant: 'muted',
        size: 'sm',
        media: <Book />,
        mediaVariant: 'icon',
        actions: (
            <Button size='sm' variant='outline'>
                Open
            </Button>
        ),
    },
};

export const WithMultipleActions: Story = {
    args: {
        title: 'Settings',
        description: 'Configure your preferences.',
        variant: 'muted',
        size: 'sm',
        media: <Settings />,
        mediaVariant: 'icon',
        actions: (
            <>
                <Button size='icon-sm' variant='ghost'>
                    <Settings />
                </Button>
                <Button size='icon-sm' variant='ghost'>
                    <Trash2 />
                </Button>
            </>
        ),
    },
};

export const WithAvatar: Story = {
    args: {
        title: 'Evil Rabbit',
        description: 'Last seen 5 months ago',
        variant: 'outline',
        media: (
            <Avatar className='size-10'>
                <AvatarImage src='https://github.com/evilrabbit.png' />
                <AvatarFallback>ER</AvatarFallback>
            </Avatar>
        ),
        actions: (
            <Button size='sm' variant='outline'>
                Invite
            </Button>
        ),
    },
};

export const WithAvatarGroup: Story = {
    args: {
        title: 'Team Members',
        description: 'Collaborate on this project.',
        variant: 'outline',
        media: (
            <div className='*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2'>
                <Avatar>
                    <AvatarImage src='https://github.com/shadcn.png' />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                    <AvatarImage src='https://github.com/evilrabbit.png' />
                    <AvatarFallback>ER</AvatarFallback>
                </Avatar>
            </div>
        ),
        actions: <Button size='sm'>Manage</Button>,
    },
};

export const WithImage: Story = {
    args: {
        title: 'Midnight City Lights',
        description: 'Neon Dreams',
        variant: 'outline',
        mediaVariant: 'image',
        media: (
            <Image
                src='https://avatar.vercel.sh/midnight'
                alt='Midnight City Lights'
                width={40}
                height={40}
                className='object-cover grayscale'
            />
        ),
    },
};

export const WithHeaderImage: Story = {
    args: {
        title: 'Model Alpha',
        description: 'High performance generation model.',
        variant: 'outline',
        header: (
            <Image
                src='https://avatar.vercel.sh/model1'
                alt='Model Alpha'
                width={128}
                height={128}
                className='aspect-square w-full rounded-sm object-cover'
            />
        ),
        actions: (
            <Button size='sm' variant='outline'>
                Select
            </Button>
        ),
    },
};

export const AllSizes: Story = {
    render: () => (
        <ItemList className='w-80'>
            {(
                [
                    {
                        size: 'default',
                        label: 'Default size',
                        description: 'Standard spacing and text.',
                    },
                    {
                        size: 'sm',
                        label: 'Small size',
                        description: 'Compact spacing and text.',
                    },
                    {
                        size: 'xs',
                        label: 'Extra small size',
                        description: 'Minimal spacing.',
                    },
                ] as const
            ).map(({ size, label, description }) => (
                <ItemGroup
                    key={size}
                    variant='muted'
                    size={size}
                    media={<Book />}
                    mediaVariant='icon'
                    title={label}
                    description={description}
                    actions={
                        <Button size='sm' variant='outline'>
                            Action
                        </Button>
                    }
                />
            ))}
        </ItemList>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <ItemList className='w-80'>
            {(['default', 'outline', 'muted'] as const).map((v) => (
                <ItemGroup
                    key={v}
                    variant={v}
                    media={<Settings />}
                    mediaVariant='icon'
                    title={`Variant: ${v}`}
                    description='Comparing visual styles side by side.'
                    actions={
                        <Button size='sm' variant='ghost'>
                            Edit
                        </Button>
                    }
                />
            ))}
        </ItemList>
    ),
};

