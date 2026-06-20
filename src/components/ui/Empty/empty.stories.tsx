import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
    FolderOpenIcon,
    InboxIcon,
    SearchXIcon,
    ShoppingCartIcon,
    UsersIcon,
    WifiOffIcon,
} from 'lucide-react';
import EmptyWrapper from '.';
import Button from '../Button';

const meta: Meta<typeof EmptyWrapper> = {
    title: 'UI/Empty',
    component: EmptyWrapper,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    argTypes: {
        mediaVariant: {
            control: 'radio',
            options: ['default', 'icon'],
        },
        icon: { control: false },
        action: { control: false },
    },
};

export default meta;
type Story = StoryObj<typeof EmptyWrapper>;

export const Default: Story = {
    args: {
        title: 'No items found',
        description: 'There are no items to display at the moment.',
        icon: <InboxIcon />,
        mediaVariant: 'icon',
    },
};

export const WithAction: Story = {
    args: {
        title: 'No items found',
        description: 'Get started by creating your first item.',
        icon: <InboxIcon />,
        mediaVariant: 'icon',
        action: <Button size="sm">Create item</Button>,
    },
};

export const NoResults: Story = {
    args: {
        title: 'No results',
        description:
            "Try adjusting your search or filter to find what you're looking for.",
        icon: <SearchXIcon />,
        mediaVariant: 'icon',
        action: (
            <Button variant="outline" size="sm">
                Clear filters
            </Button>
        ),
    },
};

export const EmptyFolder: Story = {
    args: {
        title: 'This folder is empty',
        description: 'Upload files or create a new folder to get started.',
        icon: <FolderOpenIcon />,
        mediaVariant: 'icon',
        action: (
            <div className="flex gap-2">
                <Button size="sm">Upload</Button>
                <Button variant="outline" size="sm">
                    New folder
                </Button>
            </div>
        ),
    },
};

export const EmptyCart: Story = {
    args: {
        title: 'Your cart is empty',
        description: "Looks like you haven't added anything yet.",
        icon: <ShoppingCartIcon />,
        mediaVariant: 'icon',
        action: <Button size="sm">Add Product</Button>,
    },
};

export const NoMembers: Story = {
    args: {
        title: 'No team members',
        description: 'Invite people to collaborate with you on this project.',
        icon: <UsersIcon />,
        mediaVariant: 'icon',
        action: <Button size="sm">Invite members</Button>,
    },
};

export const Offline: Story = {
    args: {
        title: 'No connection',
        description: 'Check your internet connection and try again.',
        icon: <WifiOffIcon />,
        mediaVariant: 'icon',
        action: (
            <Button variant="outline" size="sm">
                Retry
            </Button>
        ),
    },
};

export const NoIcon: Story = {
    args: {
        title: 'Nothing here yet',
        description: "Content will appear here once it's available.",
    },
};

export const LargeIcon: Story = {
    args: {
        title: 'No items found',
        description: 'There are no items to display at the moment.',
        icon: <InboxIcon className="size-10 text-muted-foreground" />,
        mediaVariant: 'default',
    },
};
