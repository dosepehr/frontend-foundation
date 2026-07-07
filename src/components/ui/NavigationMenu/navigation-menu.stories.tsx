import { DirectionProvider } from '@base-ui/react/direction-provider';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from './components';

const meta: Meta<typeof NavigationMenu> = {
    title: 'UI/NavigationMenu',
    component: NavigationMenu,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className="flex h-72 w-full items-start justify-center pt-4">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof NavigationMenu>;

// ─── Basic ───────────────────────────────────────────────────────────────

export const Basic: Story = {
    render: () => (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink
                            href="#"
                            className="w-64 flex-col items-start gap-1"
                        >
                            <div className="font-medium">Overview</div>
                            <p className="text-sm text-muted-foreground">
                                Learn the basics and get started quickly.
                            </p>
                        </NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink
                        href="#"
                        className={navigationMenuTriggerStyle()}
                    >
                        Item Two
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    ),
};

// ─── Groups ──────────────────────────────────────────────────────────────

const components = [
    {
        title: 'Alert Dialog',
        description:
            'A modal dialog that interrupts the user with important content.',
    },
    {
        title: 'Hover Card',
        description:
            'For sighted users to preview content available behind a link.',
    },
    {
        title: 'Progress',
        description:
            'Displays an indicator showing the completion progress of a task.',
    },
    {
        title: 'Tooltip',
        description: 'A popup that displays information related to an element.',
    },
];

export const Groups: Story = {
    render: () => (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-96 grid-cols-2 gap-1.5">
                            {components.map((component) => (
                                <li key={component.title}>
                                    <NavigationMenuLink
                                        href="#"
                                        className="flex-col items-start gap-1"
                                    >
                                        <div className="text-sm font-medium">
                                            {component.title}
                                        </div>
                                        <p className="line-clamp-2 text-xs text-muted-foreground">
                                            {component.description}
                                        </p>
                                    </NavigationMenuLink>
                                </li>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Documentation</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="flex w-56 flex-col gap-1">
                            <li>
                                <NavigationMenuLink href="#">
                                    Introduction
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink href="#">
                                    Installation
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink href="#">
                                    Theming
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink
                        href="#"
                        className={navigationMenuTriggerStyle()}
                    >
                        Pricing
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    ),
};

// ─── Indicator ───────────────────────────────────────────────────────────

export const Indicator: Story = {
    render: () => (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>
                        Item One
                        <NavigationMenuIndicator />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink href="#">Link</NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>
                        Item Two
                        <NavigationMenuIndicator />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink href="#">Link</NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    ),
};

// ─── Active Link ─────────────────────────────────────────────────────────

export const ActiveLink: Story = {
    render: () => {
        const [current, setCurrent] = React.useState('home');

        return (
            <div className="flex flex-col items-center gap-4">
                <NavigationMenu>
                    <NavigationMenuList>
                        {['home', 'docs', 'pricing'].map((page) => (
                            <NavigationMenuItem key={page}>
                                <NavigationMenuLink
                                    href="#"
                                    active={current === page}
                                    className={navigationMenuTriggerStyle()}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setCurrent(page);
                                    }}
                                >
                                    {page[0].toUpperCase() + page.slice(1)}
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
                <p className="text-sm text-muted-foreground">
                    Current page: {current}
                </p>
            </div>
        );
    },
};

// ─── Custom Link Component (render prop) ────────────────────────────────

function FakeRouterLink({
    href,
    ...props
}: React.ComponentProps<'a'> & { href: string }) {
    return (
        <a
            href={href}
            data-fake-router-link=""
            onClick={(event) => event.preventDefault()}
            {...props}
        />
    );
}

export const CustomLinkComponent: Story = {
    render: () => (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink
                        render={<FakeRouterLink href="/docs" />}
                        className={navigationMenuTriggerStyle()}
                    >
                        Documentation
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    ),
};

// ─── RTL ─────────────────────────────────────────────────────────────────

export const RTL: Story = {
    render: () => (
        <DirectionProvider direction="rtl">
            <div dir="rtl">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                مورد یک
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <NavigationMenuLink
                                    href="#"
                                    className="w-64 flex-col items-start gap-1"
                                >
                                    <div className="font-medium">مرور کلی</div>
                                    <p className="text-sm text-muted-foreground">
                                        شروع سریع و آشنایی با اصول اولیه.
                                    </p>
                                </NavigationMenuLink>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                href="#"
                                className={navigationMenuTriggerStyle()}
                            >
                                مورد دو
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </DirectionProvider>
    ),
};
