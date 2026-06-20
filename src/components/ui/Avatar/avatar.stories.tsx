import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PlusIcon } from 'lucide-react';
import AvatarWrapper, { AvatarGroup, AvatarGroupCount } from '.';

const meta: Meta<typeof AvatarWrapper> = {
    title: 'UI/Avatar',
    component: AvatarWrapper,
    tags: ['autodocs'],
    argTypes: {
        src: {
            control: 'text',
            description: 'Image source URL',
        },
        alt: {
            control: 'text',
            description: 'Image alt text',
        },
        fallback: {
            control: 'text',
            description: 'Fallback text shown when image fails to load',
        },
        size: {
            control: 'radio',
            options: ['sm', 'default', 'lg'],
            description: 'Size of the avatar',
        },
        className: {
            control: 'text',
            description: 'Additional class names',
        },
        badgeClassName: {
            control: 'text',
            description: 'Class names applied to the badge',
        },
    },
};

export default meta;
type Story = StoryObj<typeof AvatarWrapper>;

export const Default: Story = {
    args: {
        src: 'https://github.com/shadcn.png',
        alt: '@shadcn',
        fallback: 'CN',
    },
};

export const Fallback: Story = {
    args: {
        fallback: 'CN',
    },
};

export const WithBadge: Story = {
    args: {
        src: 'https://github.com/shadcn.png',
        alt: '@shadcn',
        fallback: 'CN',
        badgeClassName: 'bg-green-600 dark:bg-green-800',
    },
};

export const WithBadgeIcon: Story = {
    render: () => (
        <AvatarWrapper
            className="grayscale"
            src="https://github.com/pranathip.png"
            alt="@pranathip"
            fallback="PP"
            badge={<PlusIcon />}
        />
    ),
    args: {},
};

export const Sizes: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-3 grayscale">
            <AvatarWrapper
                size="sm"
                src="https://github.com/shadcn.png"
                alt="@shadcn"
                fallback="CN"
            />
            <AvatarWrapper
                size="default"
                src="https://github.com/shadcn.png"
                alt="@shadcn"
                fallback="CN"
            />
            <AvatarWrapper
                size="lg"
                src="https://github.com/shadcn.png"
                alt="@shadcn"
                fallback="CN"
            />
        </div>
    ),
    args: {},
};

export const Group: Story = {
    render: () => (
        <AvatarGroup className="grayscale">
            <AvatarWrapper
                src="https://github.com/shadcn.png"
                alt="@shadcn"
                fallback="CN"
            />
            <AvatarWrapper
                src="https://github.com/maxleiter.png"
                alt="@maxleiter"
                fallback="LR"
            />
            <AvatarWrapper
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
                fallback="ER"
            />
        </AvatarGroup>
    ),
    args: {},
};

export const GroupWithCount: Story = {
    render: () => (
        <AvatarGroup className="grayscale">
            <AvatarWrapper
                src="https://github.com/shadcn.png"
                alt="@shadcn"
                fallback="CN"
            />
            <AvatarWrapper
                src="https://github.com/maxleiter.png"
                alt="@maxleiter"
                fallback="LR"
            />
            <AvatarWrapper
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
                fallback="ER"
            />
            <AvatarGroupCount>+3</AvatarGroupCount>
        </AvatarGroup>
    ),
    args: {},
};

export const GroupWithCountIcon: Story = {
    render: () => (
        <AvatarGroup className="grayscale">
            <AvatarWrapper
                src="https://github.com/shadcn.png"
                alt="@shadcn"
                fallback="CN"
            />
            <AvatarWrapper
                src="https://github.com/maxleiter.png"
                alt="@maxleiter"
                fallback="LR"
            />
            <AvatarWrapper
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
                fallback="ER"
            />
            <AvatarGroupCount>
                <PlusIcon />
            </AvatarGroupCount>
        </AvatarGroup>
    ),
    args: {},
};
