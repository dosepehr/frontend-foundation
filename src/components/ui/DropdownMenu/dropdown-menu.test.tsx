import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from './components';
import type { DropdownGroup } from './dropdown-menu.types';
import DropdownMenuWrapper from './index';

const SIMPLE_GROUPS: DropdownGroup[] = [
    {
        items: [
            { label: 'Edit' },
            { label: 'Duplicate' },
            { label: 'Delete', variant: 'destructive' },
        ],
    },
];

describe('DropdownMenu primitives', () => {
    it('renders trigger', () => {
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Options</DropdownMenuTrigger>
            </DropdownMenu>,
        );
        expect(screen.getByText('Options')).toBeInTheDocument();
    });

    it('content is not visible by default', () => {
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Options</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>,
        );
        expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });

    it('opens on trigger click', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Options</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>,
        );
        await user.click(screen.getByText('Options'));
        expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    it('renders label', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Options</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>,
        );
        await user.click(screen.getByText('Options'));
        expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('renders separator', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Options</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>,
        );
        await user.click(screen.getByText('Options'));
        expect(
            document.querySelector('[data-slot="dropdown-menu-separator"]'),
        ).toBeInTheDocument();
    });

    it('calls onClick when item is clicked', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Options</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={onClick}>Edit</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>,
        );
        await user.click(screen.getByText('Options'));
        await user.click(screen.getByText('Edit'));
        expect(onClick).toHaveBeenCalled();
    });

    it('renders shortcut text', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Options</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        Edit
                        <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>,
        );
        await user.click(screen.getByText('Options'));
        expect(screen.getByText('⌘E')).toBeInTheDocument();
    });

    it('renders checkbox item', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Options</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuCheckboxItem
                        checked={false}
                        onCheckedChange={vi.fn()}
                    >
                        Show grid
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>,
        );
        await user.click(screen.getByText('Options'));
        expect(screen.getByText('Show grid')).toBeInTheDocument();
    });

    it('calls onCheckedChange when checkbox item is clicked', async () => {
        const user = userEvent.setup();
        const onCheckedChange = vi.fn();
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Options</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuCheckboxItem
                        checked={false}
                        onCheckedChange={onCheckedChange}
                    >
                        Show grid
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>,
        );
        await user.click(screen.getByText('Options'));
        await user.click(screen.getByText('Show grid'));
        expect(onCheckedChange).toHaveBeenCalled();
    });

    it('renders radio items', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Options</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuRadioGroup value="a" onValueChange={vi.fn()}>
                        <DropdownMenuRadioItem value="a">
                            Option A
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="b">
                            Option B
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>,
        );
        await user.click(screen.getByText('Options'));
        expect(screen.getByText('Option A')).toBeInTheDocument();
        expect(screen.getByText('Option B')).toBeInTheDocument();
    });

    it('calls onValueChange when radio item is clicked', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Options</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuRadioGroup
                        value="a"
                        onValueChange={onValueChange}
                    >
                        <DropdownMenuRadioItem value="b">
                            Option B
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>,
        );
        await user.click(screen.getByText('Options'));
        await user.click(screen.getByText('Option B'));
        expect(onValueChange).toHaveBeenCalledWith('b');
    });
});

describe('DropdownMenuWrapper', () => {
    it('renders trigger', () => {
        render(
            <DropdownMenuWrapper
                trigger={<button>Options</button>}
                groups={SIMPLE_GROUPS}
            />,
        );
        expect(screen.getByText('Options')).toBeInTheDocument();
    });

    it('opens and renders items on trigger click', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenuWrapper
                trigger={<button>Options</button>}
                groups={SIMPLE_GROUPS}
            />,
        );
        await user.click(screen.getByText('Options'));
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Duplicate')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('calls onClick when an item is clicked', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(
            <DropdownMenuWrapper
                trigger={<button>Options</button>}
                groups={[{ items: [{ label: 'Edit', onClick }] }]}
            />,
        );
        await user.click(screen.getByText('Options'));
        await user.click(screen.getByText('Edit'));
        expect(onClick).toHaveBeenCalled();
    });

    it('renders group label when provided', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenuWrapper
                trigger={<button>Options</button>}
                groups={[{ label: 'Actions', items: [{ label: 'Edit' }] }]}
            />,
        );
        await user.click(screen.getByText('Options'));
        expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('renders separator between groups', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenuWrapper
                trigger={<button>Options</button>}
                groups={[
                    { items: [{ label: 'Edit' }] },
                    { items: [{ label: 'Delete' }] },
                ]}
            />,
        );
        await user.click(screen.getByText('Options'));
        expect(
            document.querySelector('[data-slot="dropdown-menu-separator"]'),
        ).toBeInTheDocument();
    });

    it('renders shortcut when provided', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenuWrapper
                trigger={<button>Options</button>}
                groups={[{ items: [{ label: 'Edit', shortcut: '⌘E' }] }]}
            />,
        );
        await user.click(screen.getByText('Options'));
        expect(screen.getByText('⌘E')).toBeInTheDocument();
    });

    it('renders checkbox item type', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenuWrapper
                trigger={<button>Options</button>}
                groups={[
                    {
                        items: [
                            {
                                type: 'checkbox',
                                label: 'Show grid',
                                checked: false,
                                onCheckedChange: vi.fn(),
                            },
                        ],
                    },
                ]}
            />,
        );
        await user.click(screen.getByText('Options'));
        expect(screen.getByText('Show grid')).toBeInTheDocument();
    });

    it('renders radio-group item type', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenuWrapper
                trigger={<button>Options</button>}
                groups={[
                    {
                        items: [
                            {
                                type: 'radio-group',
                                value: 'a',
                                onValueChange: vi.fn(),
                                items: [
                                    { label: 'Option A' },
                                    { label: 'Option B' },
                                ],
                            },
                        ],
                    },
                ]}
            />,
        );
        await user.click(screen.getByText('Options'));
        expect(screen.getByText('Option A')).toBeInTheDocument();
        expect(screen.getByText('Option B')).toBeInTheDocument();
    });

    it('renders sub-type item with sub-trigger visible', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenuWrapper
                trigger={<button>Options</button>}
                groups={[
                    {
                        items: [
                            {
                                type: 'sub',
                                label: 'More actions',
                                items: [{ items: [{ label: 'Sub item' }] }],
                            },
                        ],
                    },
                ]}
            />,
        );
        await user.click(screen.getByText('Options'));
        expect(screen.getByText('More actions')).toBeInTheDocument();
    });
});

describe('DropdownMenu sub primitives', () => {
    it('renders DropdownMenuSubTrigger inside a sub menu', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Options</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>Sub item</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>,
        );
        await user.click(screen.getByText('Options'));
        expect(
            document.querySelector('[data-slot="dropdown-menu-sub-trigger"]'),
        ).toBeInTheDocument();
    });
});

describe('DropdownMenuSubContent', () => {
    it('renders sub-content when sub menu is forced open', () => {
        render(
            <DropdownMenu open>
                <DropdownMenuContent>
                    <DropdownMenuSub open>
                        <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>Sub item</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>,
        );
        expect(
            document.querySelector('[data-slot="dropdown-menu-sub-content"]'),
        ).toBeInTheDocument();
    });
});

describe('DropdownMenuLabel inset', () => {
    it('renders with inset prop without errors', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Options</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel inset>Inset label</DropdownMenuLabel>
                    <DropdownMenuItem>Item</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>,
        );
        await user.click(screen.getByText('Options'));
        expect(screen.getByText('Inset label')).toBeInTheDocument();
    });
});

describe('DropdownMenuItem and SubTrigger inset', () => {
    it('renders DropdownMenuItem with inset prop', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Options</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem inset>Inset item</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>,
        );
        await user.click(screen.getByText('Options'));
        expect(screen.getByText('Inset item')).toBeInTheDocument();
    });

    it('renders DropdownMenuSubTrigger with inset prop', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Options</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger inset>
                            Inset sub
                        </DropdownMenuSubTrigger>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>,
        );
        await user.click(screen.getByText('Options'));
        expect(screen.getByText('Inset sub')).toBeInTheDocument();
    });
});
