import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
    BellIcon,
    CreditCardIcon,
    FileIcon,
    LockIcon,
    SettingsIcon,
    UserIcon,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components';

const meta: Meta<typeof Tabs> = {
    title: 'UI/Tabs',
    component: Tabs,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className="w-96">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Line: Story = {
    render: () => (
        <Tabs defaultValue="account">
            <TabsList variant="line">
                <TabsTrigger variant="line" value="account">
                    Account
                </TabsTrigger>
                <TabsTrigger variant="line" value="password">
                    Password
                </TabsTrigger>
                <TabsTrigger variant="line" value="billing">
                    Billing
                </TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <p className="text-sm text-muted-foreground">
                    Manage your account details and preferences.
                </p>
            </TabsContent>
            <TabsContent value="password">
                <p className="text-sm text-muted-foreground">
                    Update your password and security settings.
                </p>
            </TabsContent>
            <TabsContent value="billing">
                <p className="text-sm text-muted-foreground">
                    View invoices and manage your subscription.
                </p>
            </TabsContent>
        </Tabs>
    ),
};

export const Pill: Story = {
    render: () => (
        <Tabs defaultValue="account">
            <TabsList variant="pill">
                <TabsTrigger variant="pill" value="account">
                    Account
                </TabsTrigger>
                <TabsTrigger variant="pill" value="password">
                    Password
                </TabsTrigger>
                <TabsTrigger variant="pill" value="billing">
                    Billing
                </TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <p className="text-sm text-muted-foreground">
                    Manage your account details and preferences.
                </p>
            </TabsContent>
            <TabsContent value="password">
                <p className="text-sm text-muted-foreground">
                    Update your password and security settings.
                </p>
            </TabsContent>
            <TabsContent value="billing">
                <p className="text-sm text-muted-foreground">
                    View invoices and manage your subscription.
                </p>
            </TabsContent>
        </Tabs>
    ),
};

export const Button: Story = {
    render: () => (
        <Tabs defaultValue="account">
            <TabsList variant="button">
                <TabsTrigger variant="button" value="account">
                    Account
                </TabsTrigger>
                <TabsTrigger variant="button" value="password">
                    Password
                </TabsTrigger>
                <TabsTrigger variant="button" value="billing">
                    Billing
                </TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <p className="text-sm text-muted-foreground">
                    Manage your account details and preferences.
                </p>
            </TabsContent>
            <TabsContent value="password">
                <p className="text-sm text-muted-foreground">
                    Update your password and security settings.
                </p>
            </TabsContent>
            <TabsContent value="billing">
                <p className="text-sm text-muted-foreground">
                    View invoices and manage your subscription.
                </p>
            </TabsContent>
        </Tabs>
    ),
};

export const WithIcons: Story = {
    render: () => (
        <Tabs defaultValue="profile">
            <TabsList variant="line">
                <TabsTrigger variant="line" value="profile">
                    <UserIcon />
                    Profile
                </TabsTrigger>
                <TabsTrigger variant="line" value="notifications">
                    <BellIcon />
                    Notifications
                </TabsTrigger>
                <TabsTrigger variant="line" value="security">
                    <LockIcon />
                    Security
                </TabsTrigger>
                <TabsTrigger variant="line" value="billing">
                    <CreditCardIcon />
                    Billing
                </TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
                <p className="text-sm text-muted-foreground">
                    Update your name, photo, and personal details.
                </p>
            </TabsContent>
            <TabsContent value="notifications">
                <p className="text-sm text-muted-foreground">
                    Choose what you want to be notified about.
                </p>
            </TabsContent>
            <TabsContent value="security">
                <p className="text-sm text-muted-foreground">
                    Manage passwords, two-factor auth, and sessions.
                </p>
            </TabsContent>
            <TabsContent value="billing">
                <p className="text-sm text-muted-foreground">
                    View invoices and manage your subscription.
                </p>
            </TabsContent>
        </Tabs>
    ),
};

export const WithDisabled: Story = {
    render: () => (
        <Tabs defaultValue="files">
            <TabsList variant="pill">
                <TabsTrigger variant="pill" value="files">
                    <FileIcon />
                    Files
                </TabsTrigger>
                <TabsTrigger variant="pill" value="settings">
                    <SettingsIcon />
                    Settings
                </TabsTrigger>
                <TabsTrigger variant="pill" value="archive" disabled>
                    Archive
                </TabsTrigger>
            </TabsList>
            <TabsContent value="files">
                <p className="text-sm text-muted-foreground">
                    Browse and manage your uploaded files.
                </p>
            </TabsContent>
            <TabsContent value="settings">
                <p className="text-sm text-muted-foreground">
                    Configure your workspace settings.
                </p>
            </TabsContent>
        </Tabs>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-8">
            {(['line', 'pill', 'button'] as const).map((variant) => (
                <Tabs key={variant} defaultValue="tab1">
                    <TabsList variant={variant}>
                        <TabsTrigger variant={variant} value="tab1">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger variant={variant} value="tab2">
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger variant={variant} value="tab3">
                            Reports
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">
                        <p className="text-sm text-muted-foreground capitalize">
                            {variant} variant — overview content.
                        </p>
                    </TabsContent>
                    <TabsContent value="tab2">
                        <p className="text-sm text-muted-foreground capitalize">
                            {variant} variant — analytics content.
                        </p>
                    </TabsContent>
                    <TabsContent value="tab3">
                        <p className="text-sm text-muted-foreground capitalize">
                            {variant} variant — reports content.
                        </p>
                    </TabsContent>
                </Tabs>
            ))}
        </div>
    ),
};
