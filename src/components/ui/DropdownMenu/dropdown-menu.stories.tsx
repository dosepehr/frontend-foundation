import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
    BellIcon,
    CopyIcon,
    CreditCardIcon,
    DownloadIcon,
    EyeIcon,
    FileCodeIcon,
    FileIcon,
    FileTextIcon,
    FolderIcon,
    FolderOpenIcon,
    FolderSearchIcon,
    HelpCircleIcon,
    KeyboardIcon,
    LanguagesIcon,
    LayoutIcon,
    LogOutIcon,
    MailIcon,
    MonitorIcon,
    MoonIcon,
    MoreHorizontalIcon,
    MoreVerticalIcon,
    PaletteIcon,
    PencilIcon,
    SaveIcon,
    SettingsIcon,
    ShieldIcon,
    SunIcon,
    Trash2Icon,
    UserIcon,
} from 'lucide-react';
import * as React from 'react';
import DropdownMenuWrapper from '.';
import { Button } from '../Button/components';

const meta = {
    title: 'UI/DropdownMenu',
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Wrapper stories ──────────────────────────────────────────────────────────

export const Simple: Story = {
    render: () => (
        <DropdownMenuWrapper
            trigger={<Button variant="outline">Open</Button>}
            groups={[
                {
                    items: [
                        {
                            label: 'Profile',
                            icon: <UserIcon />,
                            shortcut: '⇧⌘P',
                        },
                        { label: 'Billing', icon: <CreditCardIcon /> },
                        {
                            label: 'Settings',
                            icon: <SettingsIcon />,
                            shortcut: '⌘,',
                        },
                    ],
                },
                {
                    items: [
                        {
                            label: 'Log out',
                            icon: <LogOutIcon />,
                            variant: 'destructive',
                            shortcut: '⇧⌘Q',
                        },
                    ],
                },
            ]}
        />
    ),
};

export const WithLabels: Story = {
    render: () => (
        <DropdownMenuWrapper
            trigger={<Button variant="outline">My Account</Button>}
            groups={[
                {
                    label: 'My Account',
                    items: [
                        {
                            label: 'Profile',
                            icon: <UserIcon />,
                            shortcut: '⇧⌘P',
                        },
                        { label: 'Billing', icon: <CreditCardIcon /> },
                        { label: 'Settings', icon: <SettingsIcon /> },
                    ],
                },
                {
                    label: 'Help',
                    items: [
                        { label: 'Documentation', icon: <FileTextIcon /> },
                        { label: 'Support', icon: <HelpCircleIcon /> },
                    ],
                },
                {
                    items: [
                        {
                            label: 'Log out',
                            icon: <LogOutIcon />,
                            variant: 'destructive',
                        },
                    ],
                },
            ]}
        />
    ),
};

export const WithCheckboxItems: Story = {
    render: () => {
        const [state, setReact] = React.useState({
            sidebar: true,
            statusBar: false,
            minimap: true,
        });
        return (
            <DropdownMenuWrapper
                trigger={<Button variant="outline">View</Button>}
                groups={[
                    {
                        label: 'View',
                        items: [
                            {
                                type: 'checkbox',
                                label: 'Show Sidebar',
                                icon: <EyeIcon />,
                                checked: state.sidebar,
                                onCheckedChange: (v) =>
                                    setReact((s) => ({ ...s, sidebar: v })),
                            },
                            {
                                type: 'checkbox',
                                label: 'Show Status Bar',
                                icon: <LayoutIcon />,
                                checked: state.statusBar,
                                onCheckedChange: (v) =>
                                    setReact((s) => ({ ...s, statusBar: v })),
                            },
                            {
                                type: 'checkbox',
                                label: 'Show Minimap',
                                icon: <MonitorIcon />,
                                checked: state.minimap,
                                onCheckedChange: (v) =>
                                    setReact((s) => ({ ...s, minimap: v })),
                            },
                        ],
                    },
                ]}
            />
        );
    },
};

export const WithRadioItems: Story = {
    render: () => {
        const [theme, setTheme] = React.useState('light');
        return (
            <DropdownMenuWrapper
                trigger={<Button variant="outline">Theme: {theme}</Button>}
                groups={[
                    {
                        label: 'Appearance',
                        items: [
                            {
                                type: 'radio-group',
                                value: theme,
                                onValueChange: setTheme,
                                items: [
                                    { label: 'Light', icon: <SunIcon /> },
                                    { label: 'Dark', icon: <MoonIcon /> },
                                    { label: 'System', icon: <MonitorIcon /> },
                                ],
                            },
                        ],
                    },
                ]}
            />
        );
    },
};

export const WithSubMenu: Story = {
    render: () => (
        <DropdownMenuWrapper
            trigger={<Button variant="outline">File</Button>}
            groups={[
                {
                    label: 'File',
                    items: [
                        {
                            label: 'New File',
                            icon: <FileIcon />,
                            shortcut: '⌘N',
                        },
                        {
                            label: 'New Folder',
                            icon: <FolderIcon />,
                            shortcut: '⇧⌘N',
                        },
                        {
                            type: 'sub',
                            label: 'Open Recent',
                            icon: <FolderOpenIcon />,
                            items: [
                                {
                                    label: 'Recent Files',
                                    items: [
                                        {
                                            label: 'Project Alpha',
                                            icon: <FileCodeIcon />,
                                        },
                                        {
                                            label: 'Project Beta',
                                            icon: <FileCodeIcon />,
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'Browse...',
                                            icon: <FolderSearchIcon />,
                                        },
                                    ],
                                },
                            ],
                        },
                        { label: 'Save', icon: <SaveIcon />, shortcut: '⌘S' },
                        {
                            label: 'Export',
                            icon: <DownloadIcon />,
                            shortcut: '⇧⌘E',
                        },
                    ],
                },
            ]}
        />
    ),
};

export const RowActions: Story = {
    render: () => (
        <DropdownMenuWrapper
            trigger={
                <Button variant="ghost" size="icon-sm">
                    <MoreVerticalIcon />
                </Button>
            }
            align="end"
            groups={[
                {
                    items: [
                        { label: 'Edit', icon: <PencilIcon /> },
                        { label: 'Duplicate', icon: <CopyIcon /> },
                    ],
                },
                {
                    items: [
                        {
                            label: 'Delete',
                            icon: <Trash2Icon />,
                            variant: 'destructive',
                        },
                    ],
                },
            ]}
        />
    ),
};

// ─── Complex wrapper story ────────────────────────────────────────────────────

export const Complex: Story = {
    render: () => {
        const [notifications, setNotifications] = React.useState({
            email: true,
            sms: false,
            push: true,
        });
        const [theme, setTheme] = React.useState('light');

        return (
            <DropdownMenuWrapper
                trigger={<Button variant="outline">Complex Menu</Button>}
                contentClassName="w-44"
                groups={[
                    {
                        label: 'File',
                        items: [
                            {
                                label: 'New File',
                                icon: <FileIcon />,
                                shortcut: '⌘N',
                            },
                            {
                                label: 'New Folder',
                                icon: <FolderIcon />,
                                shortcut: '⇧⌘N',
                            },
                            {
                                type: 'sub',
                                label: 'Open Recent',
                                icon: <FolderOpenIcon />,
                                items: [
                                    {
                                        label: 'Recent Projects',
                                        items: [
                                            {
                                                label: 'Project Alpha',
                                                icon: <FileCodeIcon />,
                                            },
                                            {
                                                label: 'Project Beta',
                                                icon: <FileCodeIcon />,
                                            },
                                            {
                                                type: 'sub',
                                                label: 'More Projects',
                                                icon: <MoreHorizontalIcon />,
                                                items: [
                                                    {
                                                        items: [
                                                            {
                                                                label: 'Project Gamma',
                                                                icon: (
                                                                    <FileCodeIcon />
                                                                ),
                                                            },
                                                            {
                                                                label: 'Project Delta',
                                                                icon: (
                                                                    <FileCodeIcon />
                                                                ),
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        items: [
                                            {
                                                label: 'Browse...',
                                                icon: <FolderSearchIcon />,
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                label: 'Save',
                                icon: <SaveIcon />,
                                shortcut: '⌘S',
                            },
                            {
                                label: 'Export',
                                icon: <DownloadIcon />,
                                shortcut: '⇧⌘E',
                            },
                        ],
                    },
                    {
                        label: 'View',
                        items: [
                            {
                                type: 'checkbox',
                                label: 'Show Sidebar',
                                icon: <EyeIcon />,
                                checked: notifications.email,
                                onCheckedChange: (v) =>
                                    setNotifications((s) => ({
                                        ...s,
                                        email: v,
                                    })),
                            },
                            {
                                type: 'checkbox',
                                label: 'Show Status Bar',
                                icon: <LayoutIcon />,
                                checked: notifications.sms,
                                onCheckedChange: (v) =>
                                    setNotifications((s) => ({ ...s, sms: v })),
                            },
                            {
                                type: 'sub',
                                label: 'Theme',
                                icon: <PaletteIcon />,
                                items: [
                                    {
                                        label: 'Appearance',
                                        items: [
                                            {
                                                type: 'radio-group',
                                                value: theme,
                                                onValueChange: setTheme,
                                                items: [
                                                    {
                                                        label: 'Light',
                                                        icon: <SunIcon />,
                                                    },
                                                    {
                                                        label: 'Dark',
                                                        icon: <MoonIcon />,
                                                    },
                                                    {
                                                        label: 'System',
                                                        icon: <MonitorIcon />,
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        label: 'Account',
                        items: [
                            {
                                label: 'Profile',
                                icon: <UserIcon />,
                                shortcut: '⇧⌘P',
                            },
                            { label: 'Billing', icon: <CreditCardIcon /> },
                            {
                                type: 'sub',
                                label: 'Settings',
                                icon: <SettingsIcon />,
                                items: [
                                    {
                                        label: 'Preferences',
                                        items: [
                                            {
                                                label: 'Keyboard Shortcuts',
                                                icon: <KeyboardIcon />,
                                            },
                                            {
                                                label: 'Language',
                                                icon: <LanguagesIcon />,
                                            },
                                            {
                                                type: 'sub',
                                                label: 'Notifications',
                                                icon: <BellIcon />,
                                                items: [
                                                    {
                                                        label: 'Notification Types',
                                                        items: [
                                                            {
                                                                type: 'checkbox',
                                                                label: 'Push Notifications',
                                                                icon: (
                                                                    <BellIcon />
                                                                ),
                                                                checked:
                                                                    notifications.push,
                                                                onCheckedChange:
                                                                    (v) =>
                                                                        setNotifications(
                                                                            (
                                                                                s,
                                                                            ) => ({
                                                                                ...s,
                                                                                push: v,
                                                                            }),
                                                                        ),
                                                            },
                                                            {
                                                                type: 'checkbox',
                                                                label: 'Email Notifications',
                                                                icon: (
                                                                    <MailIcon />
                                                                ),
                                                                checked:
                                                                    notifications.email,
                                                                onCheckedChange:
                                                                    (v) =>
                                                                        setNotifications(
                                                                            (
                                                                                s,
                                                                            ) => ({
                                                                                ...s,
                                                                                email: v,
                                                                            }),
                                                                        ),
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        items: [
                                            {
                                                label: 'Privacy & Security',
                                                icon: <ShieldIcon />,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        items: [
                            {
                                label: 'Help & Support',
                                icon: <HelpCircleIcon />,
                            },
                            { label: 'Documentation', icon: <FileTextIcon /> },
                        ],
                    },
                    {
                        items: [
                            {
                                label: 'Sign Out',
                                icon: <LogOutIcon />,
                                variant: 'destructive',
                                shortcut: '⇧⌘Q',
                            },
                        ],
                    },
                ]}
            />
        );
    },
};
