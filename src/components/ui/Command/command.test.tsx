import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from './components';

describe('Command', () => {
    it('renders without errors', () => {
        expect(() =>
            render(
                <Command>
                    <CommandList />
                </Command>,
            ),
        ).not.toThrow();
    });

    it('renders CommandInput', () => {
        render(
            <Command>
                <CommandInput placeholder="Search..." />
                <CommandList />
            </Command>,
        );
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('renders CommandItem children', () => {
        render(
            <Command>
                <CommandList>
                    <CommandGroup>
                        <CommandItem value="apple">Apple</CommandItem>
                        <CommandItem value="banana">Banana</CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>,
        );
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('calls onSelect when an item is clicked', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        render(
            <Command>
                <CommandList>
                    <CommandGroup>
                        <CommandItem value="apple" onSelect={onSelect}>
                            Apple
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>,
        );
        await user.click(screen.getByText('Apple'));
        expect(onSelect).toHaveBeenCalledWith('apple');
    });

    it('does not throw when clicking an item without onSelect', async () => {
        const user = userEvent.setup();
        render(
            <Command>
                <CommandList>
                    <CommandGroup>
                        <CommandItem value="apple">Apple</CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>,
        );
        await expect(
            user.click(screen.getByText('Apple')),
        ).resolves.not.toThrow();
    });

    it('shows CommandEmpty when no items match the search', async () => {
        const user = userEvent.setup();
        render(
            <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                    <CommandEmpty>No results found</CommandEmpty>
                    <CommandGroup>
                        <CommandItem value="apple">Apple</CommandItem>
                        <CommandItem value="banana">Banana</CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>,
        );
        await user.type(screen.getByPlaceholderText('Search...'), 'xyz');
        expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    it('keeps matching items visible when search matches value', async () => {
        const user = userEvent.setup();
        render(
            <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                    <CommandGroup>
                        <CommandItem value="apple">Apple</CommandItem>
                        <CommandItem value="banana">Banana</CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>,
        );
        await user.type(screen.getByPlaceholderText('Search...'), 'apple');
        const items = document.querySelectorAll('[data-command-item]');
        const apple = Array.from(items).find((el) =>
            el.textContent?.includes('Apple'),
        ) as HTMLElement;
        expect(apple?.style.display).not.toBe('none');
    });

    it('shows item that matches keyword but not value', async () => {
        const user = userEvent.setup();
        render(
            <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                    <CommandGroup>
                        <CommandItem
                            value="item-1"
                            keywords={['special-keyword']}
                        >
                            Item One
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>,
        );
        await user.type(screen.getByPlaceholderText('Search...'), 'special');
        const item = document.querySelector(
            '[data-command-item]',
        ) as HTMLElement;
        expect(item?.style.display).not.toBe('none');
    });

    it('shows all items when shouldFilter is false regardless of search', async () => {
        const user = userEvent.setup();
        render(
            <Command shouldFilter={false}>
                <CommandInput placeholder="Search..." />
                <CommandList>
                    <CommandGroup>
                        <CommandItem value="apple">Apple</CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>,
        );
        await user.type(screen.getByPlaceholderText('Search...'), 'xyz');
        expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('calls onSearchChange when input changes', async () => {
        const user = userEvent.setup();
        const onSearchChange = vi.fn();
        render(
            <Command onSearchChange={onSearchChange}>
                <CommandInput placeholder="Search..." />
                <CommandList />
            </Command>,
        );
        await user.type(screen.getByPlaceholderText('Search...'), 'a');
        expect(onSearchChange).toHaveBeenCalledWith('a');
    });
});

describe('CommandInput controlled mode', () => {
    it('displays controlled value', () => {
        render(
            <Command>
                <CommandInput value="controlled" />
                <CommandList />
            </Command>,
        );
        expect(screen.getByDisplayValue('controlled')).toBeInTheDocument();
    });

    it('calls onValueChange but not internal setSearch when value prop is provided', () => {
        const onValueChange = vi.fn();
        render(
            <Command>
                <CommandInput value="initial" onValueChange={onValueChange} />
                <CommandList />
            </Command>,
        );
        fireEvent.change(screen.getByDisplayValue('initial'), {
            target: { value: 'new' },
        });
        expect(onValueChange).toHaveBeenCalledWith('new');
    });

    it('calls onValueChange in uncontrolled mode', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(
            <Command>
                <CommandInput
                    placeholder="Search..."
                    onValueChange={onValueChange}
                />
                <CommandList />
            </Command>,
        );
        await user.type(screen.getByPlaceholderText('Search...'), 'a');
        expect(onValueChange).toHaveBeenCalledWith('a');
    });
});

describe('CommandDialog', () => {
    it('does not render content when closed', () => {
        render(
            <CommandDialog open={false} onOpenChange={() => {}}>
                <Command>
                    <CommandList>
                        <CommandGroup>
                            <CommandItem value="apple">Apple</CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </CommandDialog>,
        );
        expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    });

    it('renders content when open', () => {
        render(
            <CommandDialog open onOpenChange={() => {}}>
                <Command>
                    <CommandList>
                        <CommandGroup>
                            <CommandItem value="apple">Apple</CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </CommandDialog>,
        );
        expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('renders an accessible title', () => {
        render(
            <CommandDialog open onOpenChange={() => {}} title="My Palette">
                <Command>
                    <CommandList />
                </Command>
            </CommandDialog>,
        );
        expect(
            screen.getByRole('heading', { name: 'My Palette' }),
        ).toBeInTheDocument();
    });

    it('calls onOpenChange when closed', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        render(
            <CommandDialog open onOpenChange={onOpenChange}>
                <Command>
                    <CommandList />
                </Command>
            </CommandDialog>,
        );
        await user.keyboard('{Escape}');
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('selecting an item can close the dialog', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        render(
            <CommandDialog open onOpenChange={onOpenChange}>
                <Command>
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                value="apple"
                                onSelect={() => onOpenChange(false)}
                            >
                                Apple
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </CommandDialog>,
        );
        await user.click(screen.getByText('Apple'));
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });
});
