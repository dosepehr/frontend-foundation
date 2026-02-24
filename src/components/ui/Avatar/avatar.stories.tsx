import { CheckIcon, BellIcon, StarIcon, ShieldIcon } from 'lucide-react';
import { AvatarItem } from './avatar.props';
import AvatarGroup from '.';
import { Meta, StoryObj } from '@storybook/nextjs-vite';

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
    {
        src: 'https://i.pravatar.cc/150?img=5',
        fallback: 'EN',
        alt: 'Eva Nash',
    },
    {
        src: 'https://i.pravatar.cc/150?img=6',
        fallback: 'FP',
        alt: 'Frank Park',
    },
    {
        src: 'https://i.pravatar.cc/150?img=7',
        fallback: 'GH',
        alt: 'Grace Hall',
    },
];

const fallbackOnlyAvatars: AvatarItem[] = [
    { fallback: 'AB' },
    { fallback: 'CD' },
    { fallback: 'EF' },
    { fallback: 'GH' },
];

const meta: Meta<typeof AvatarGroup> = {
    title: 'Components/AvatarGroup',
    component: AvatarGroup,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'default', 'lg'],
        },
        max: {
            control: 'number',
        },
    },
    args: {
        avatars: sampleAvatars,
        size: 'default',
    },
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

export const Default: Story = {
    args: {
        avatars: sampleAvatars.slice(0, 4),
    },
};

export const WithOverflow: Story = {
    args: {
        avatars: sampleAvatars,
        max: 4,
    },
};

export const SmallSize: Story = {
    args: {
        avatars: sampleAvatars.slice(0, 5),
        size: 'sm',
        max: 3,
    },
};

export const LargeSize: Story = {
    args: {
        avatars: sampleAvatars.slice(0, 5),
        size: 'lg',
        max: 3,
    },
};

export const AllSizes: Story = {
    render: (args) => (
        <div className='flex flex-col items-start gap-6'>
            <div className='flex flex-col gap-2'>
                <span className='text-muted-foreground text-xs'>sm</span>
                <AvatarGroup {...args} size='sm' />
            </div>
            <div className='flex flex-col gap-2'>
                <span className='text-muted-foreground text-xs'>default</span>
                <AvatarGroup {...args} size='default' />
            </div>
            <div className='flex flex-col gap-2'>
                <span className='text-muted-foreground text-xs'>lg</span>
                <AvatarGroup {...args} size='lg' />
            </div>
        </div>
    ),
    args: {
        avatars: sampleAvatars.slice(0, 5),
        max: 3,
    },
};

export const FallbackOnly: Story = {
    args: {
        avatars: fallbackOnlyAvatars,
    },
};

export const FallbackWithOverflow: Story = {
    args: {
        avatars: fallbackOnlyAvatars,
        max: 2,
    },
};

export const WithBadges: Story = {
    args: {
        avatars: [
            {
                src: 'https://i.pravatar.cc/150?img=10',
                fallback: 'AL',
                alt: 'Alice Lee',
                badge: true
            },
            {
                src: 'https://i.pravatar.cc/150?img=11',
                fallback: 'BM',
                alt: 'Bob Martin',
                badge: true
            },
            {
                src: 'https://i.pravatar.cc/150?img=12',
                fallback: 'CR',
                alt: 'Clara Reed',
                badge: true
            },
            {
                src: 'https://i.pravatar.cc/150?img=13',
                fallback: 'DK',
                alt: 'David Kim',
                badge: true
            },
        ],
    },
};

export const MixedSources: Story = {
    args: {
        avatars: [
            {
                src: 'https://i.pravatar.cc/150?img=20',
                fallback: 'AL',
                alt: 'Alice Lee',
            },
            {
                fallback: 'BM',
            },
            {
                src: 'https://i.pravatar.cc/150?img=22',
                fallback: 'CR',
                alt: 'Clara Reed',
            },
            {
                fallback: 'DK',
            },
            {
                src: 'https://i.pravatar.cc/150?img=24',
                fallback: 'EN',
                alt: 'Eva Nash',
            },
        ],
        max: 4,
    },
};

export const SingleAvatar: Story = {
    args: {
        avatars: [
            {
                src: 'https://i.pravatar.cc/150?img=30',
                fallback: 'JD',
                alt: 'John Doe',
            },
        ],
    },
};

export const TwoAvatars: Story = {
    args: {
        avatars: [
            {
                src: 'https://i.pravatar.cc/150?img=31',
                fallback: 'AL',
                alt: 'Alice Lee',
            },
            {
                src: 'https://i.pravatar.cc/150?img=32',
                fallback: 'BM',
                alt: 'Bob Martin',
            },
        ],
    },
};

export const LargeOverflow: Story = {
    args: {
        avatars: sampleAvatars,
        max: 2,
    },
};

