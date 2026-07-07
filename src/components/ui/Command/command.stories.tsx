import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
    CalculatorIcon,
    CalendarIcon,
    CreditCardIcon,
    SettingsIcon,
    SmileIcon,
    UserIcon,
} from 'lucide-react';
import * as React from 'react';
import Button from '../Button';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from './components';

const meta: Meta<typeof Command> = {
    title: 'UI/Command',
    component: Command,
    tags: ['autodocs'],
    argTypes: {
        shouldFilter: { control: 'boolean' },
    },
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Command>;

function CommandGroupHeading({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
            {children}
        </div>
    );
}

// ─── Basic ───────────────────────────────────────────────────────────────

export const Basic: Story = {
    render: () => (
        <Command className="rounded-lg border">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    <CommandGroupHeading>Suggestions</CommandGroupHeading>
                    <CommandItem value="calendar">Calendar</CommandItem>
                    <CommandItem value="search-emoji">Search Emoji</CommandItem>
                    <CommandItem value="calculator">Calculator</CommandItem>
                </CommandGroup>
                <CommandGroup>
                    <CommandGroupHeading>Settings</CommandGroupHeading>
                    <CommandItem value="profile">Profile</CommandItem>
                    <CommandItem value="billing">Billing</CommandItem>
                    <CommandItem value="settings">Settings</CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>
    ),
};

// ─── Groups ──────────────────────────────────────────────────────────────

export const Groups: Story = {
    render: () => (
        <Command className="rounded-lg border">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    <CommandGroupHeading>Suggestions</CommandGroupHeading>
                    <CommandItem value="calendar" className="gap-2">
                        <CalendarIcon className="size-4" />
                        <span>Calendar</span>
                    </CommandItem>
                    <CommandItem value="search-emoji" className="gap-2">
                        <SmileIcon className="size-4" />
                        <span>Search Emoji</span>
                    </CommandItem>
                    <CommandItem value="calculator" className="gap-2">
                        <CalculatorIcon className="size-4" />
                        <span>Calculator</span>
                    </CommandItem>
                </CommandGroup>
                <div className="mx-1 my-1 h-px bg-border" />
                <CommandGroup>
                    <CommandGroupHeading>Settings</CommandGroupHeading>
                    <CommandItem value="profile" className="gap-2">
                        <UserIcon className="size-4" />
                        <span>Profile</span>
                    </CommandItem>
                    <CommandItem value="billing" className="gap-2">
                        <CreditCardIcon className="size-4" />
                        <span>Billing</span>
                    </CommandItem>
                    <CommandItem value="settings" className="gap-2">
                        <SettingsIcon className="size-4" />
                        <span>Settings</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>
    ),
};

// ─── Shortcuts ───────────────────────────────────────────────────────────

function CommandShortcutDemo({ children }: { children: React.ReactNode }) {
    return (
        <span className="ms-auto text-xs tracking-widest text-muted-foreground">
            {children}
        </span>
    );
}

export const Shortcuts: Story = {
    render: () => (
        <Command className="rounded-lg border">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    <CommandGroupHeading>Suggestions</CommandGroupHeading>
                    <CommandItem value="profile" className="justify-between">
                        <span>Profile</span>
                        <CommandShortcutDemo>⌘P</CommandShortcutDemo>
                    </CommandItem>
                    <CommandItem value="billing" className="justify-between">
                        <span>Billing</span>
                        <CommandShortcutDemo>⌘B</CommandShortcutDemo>
                    </CommandItem>
                    <CommandItem value="settings" className="justify-between">
                        <span>Settings</span>
                        <CommandShortcutDemo>⌘S</CommandShortcutDemo>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>
    ),
};

// ─── Scrollable ──────────────────────────────────────────────────────────

const fruits = [
    'Apple',
    'Banana',
    'Blueberry',
    'Cherry',
    'Grape',
    'Kiwi',
    'Lemon',
    'Mango',
    'Orange',
    'Papaya',
    'Peach',
    'Pear',
    'Pineapple',
    'Plum',
    'Raspberry',
    'Strawberry',
    'Watermelon',
];

export const Scrollable: Story = {
    render: () => (
        <Command className="rounded-lg border">
            <CommandInput placeholder="Search fruit..." />
            <CommandList className="max-h-64 overflow-y-auto">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    <CommandGroupHeading>Fruits</CommandGroupHeading>
                    {fruits.map((fruit) => (
                        <CommandItem key={fruit} value={fruit.toLowerCase()}>
                            {fruit}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    ),
};

// ─── Selectable ──────────────────────────────────────────────────────────

export const Selectable: Story = {
    render: () => {
        const [selected, setSelected] = React.useState<string | null>(null);

        return (
            <div className="flex flex-col gap-2">
                <Command className="rounded-lg border">
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            <CommandGroupHeading>
                                Suggestions
                            </CommandGroupHeading>
                            <CommandItem
                                value="calendar"
                                onSelect={setSelected}
                                className={
                                    selected === 'calendar'
                                        ? 'bg-accent text-accent-foreground'
                                        : undefined
                                }
                            >
                                Calendar
                            </CommandItem>
                            <CommandItem
                                value="search-emoji"
                                onSelect={setSelected}
                                className={
                                    selected === 'search-emoji'
                                        ? 'bg-accent text-accent-foreground'
                                        : undefined
                                }
                            >
                                Search Emoji
                            </CommandItem>
                            <CommandItem
                                value="calculator"
                                onSelect={setSelected}
                                className={
                                    selected === 'calculator'
                                        ? 'bg-accent text-accent-foreground'
                                        : undefined
                                }
                            >
                                Calculator
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
                <p className="text-sm text-muted-foreground">
                    Selected: {selected ?? '(none)'}
                </p>
            </div>
        );
    },
};

// ─── Controlled search ───────────────────────────────────────────────────

export const ControlledSearch: Story = {
    render: () => {
        const [search, setSearch] = React.useState('');

        return (
            <div className="flex flex-col gap-2">
                <Command className="rounded-lg border">
                    <CommandInput
                        value={search}
                        onValueChange={setSearch}
                        placeholder="Type a command or search..."
                    />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            <CommandGroupHeading>
                                Suggestions
                            </CommandGroupHeading>
                            <CommandItem value="calendar">Calendar</CommandItem>
                            <CommandItem value="search-emoji">
                                Search Emoji
                            </CommandItem>
                            <CommandItem value="calculator">
                                Calculator
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
                <p className="text-sm text-muted-foreground">
                    Search: {search || '(empty)'}
                </p>
            </div>
        );
    },
};

// ─── No filtering ────────────────────────────────────────────────────────

export const WithoutFiltering: Story = {
    args: {
        shouldFilter: false,
    },
    render: (args) => (
        <Command {...args} className="rounded-lg border">
            <CommandInput placeholder="Search does not filter items..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    <CommandGroupHeading>Suggestions</CommandGroupHeading>
                    <CommandItem value="calendar">Calendar</CommandItem>
                    <CommandItem value="search-emoji">Search Emoji</CommandItem>
                    <CommandItem value="calculator">Calculator</CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>
    ),
};

// ─── Dialog ──────────────────────────────────────────────────────────────

export const Dialog: Story = {
    render: () => {
        const [open, setOpen] = React.useState(false);

        return (
            <div className="flex flex-col gap-4">
                <Button
                    onClick={() => setOpen(true)}
                    variant="outline"
                    className="w-fit"
                >
                    Open Menu
                </Button>
                <CommandDialog open={open} onOpenChange={setOpen}>
                    <Command>
                        <CommandInput placeholder="Type a command or search..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                <CommandGroupHeading>
                                    Suggestions
                                </CommandGroupHeading>
                                <CommandItem
                                    value="calendar"
                                    onSelect={() => setOpen(false)}
                                >
                                    Calendar
                                </CommandItem>
                                <CommandItem
                                    value="search-emoji"
                                    onSelect={() => setOpen(false)}
                                >
                                    Search Emoji
                                </CommandItem>
                                <CommandItem
                                    value="calculator"
                                    onSelect={() => setOpen(false)}
                                >
                                    Calculator
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </CommandDialog>
            </div>
        );
    },
};

