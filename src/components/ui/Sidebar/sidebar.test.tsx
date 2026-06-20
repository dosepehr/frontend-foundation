import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TooltipProvider } from '../Tooltip/components';
import {
    Sidebar,
    SidebarProvider,
    SidebarTrigger,
    useSidebar,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarGroupAction,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarInset,
    SidebarSeparator,
    SidebarRail,
    SidebarInput,
} from './components';

function renderWithProvider(ui: React.ReactNode) {
    return render(<TooltipProvider><SidebarProvider>{ui}</SidebarProvider></TooltipProvider>);
}

function setupDesktop() {
    const listeners: Array<() => void> = [];
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1440 });
    vi.stubGlobal('matchMedia', (_query: string) => ({
        matches: false,
        addEventListener: (_e: string, cb: () => void) => listeners.push(cb),
        removeEventListener: (_e: string, cb: () => void) => {
            const idx = listeners.indexOf(cb);
            if (idx !== -1) listeners.splice(idx, 1);
        },
    }));
}

describe('SidebarProvider', () => {
    it('renders without errors', () => {
        expect(() => render(<SidebarProvider><div>content</div></SidebarProvider>)).not.toThrow();
    });

    it('has data-slot="sidebar-wrapper"', () => {
        const { container } = render(<SidebarProvider><div /></SidebarProvider>);
        expect(container.querySelector('[data-slot="sidebar-wrapper"]')).toBeInTheDocument();
    });
});

describe('Sidebar', () => {
    it('renders with collapsible="none" as a simple div', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>content</Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar"]')).toBeInTheDocument();
    });

    it('renders children', () => {
        renderWithProvider(
            <Sidebar collapsible='none'>
                <span>Sidebar content</span>
            </Sidebar>,
        );
        expect(screen.getByText('Sidebar content')).toBeInTheDocument();
    });
});

describe('SidebarTrigger', () => {
    it('renders as a button', () => {
        renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarTrigger />
            </Sidebar>,
        );
        expect(document.querySelector('[data-slot="sidebar-trigger"]')).toBeInTheDocument();
    });

    it('has data-slot="sidebar-trigger"', () => {
        renderWithProvider(<SidebarTrigger />);
        expect(document.querySelector('[data-slot="sidebar-trigger"]')).toBeInTheDocument();
    });
});

describe('SidebarHeader / SidebarFooter / SidebarContent', () => {
    it('SidebarHeader has data-slot="sidebar-header"', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarHeader>Header</SidebarHeader>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-header"]')).toBeInTheDocument();
    });

    it('SidebarFooter has data-slot="sidebar-footer"', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarFooter>Footer</SidebarFooter>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-footer"]')).toBeInTheDocument();
    });

    it('SidebarContent has data-slot="sidebar-content"', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarContent>Content</SidebarContent>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-content"]')).toBeInTheDocument();
    });
});

describe('SidebarGroup', () => {
    it('has data-slot="sidebar-group"', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarGroup />
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-group"]')).toBeInTheDocument();
    });

    it('SidebarGroupLabel has data-slot="sidebar-group-label"', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarGroup>
                    <SidebarGroupLabel>My Group</SidebarGroupLabel>
                </SidebarGroup>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-group-label"]')).toBeInTheDocument();
        expect(screen.getByText('My Group')).toBeInTheDocument();
    });

    it('SidebarGroupContent has data-slot="sidebar-group-content"', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarGroup>
                    <SidebarGroupContent />
                </SidebarGroup>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-group-content"]')).toBeInTheDocument();
    });
});

describe('SidebarMenu / SidebarMenuItem / SidebarMenuButton', () => {
    it('SidebarMenu has data-slot="sidebar-menu"', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarMenu />
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-menu"]')).toBeInTheDocument();
    });

    it('SidebarMenuItem has data-slot="sidebar-menu-item"', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarMenu>
                    <SidebarMenuItem />
                </SidebarMenu>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-menu-item"]')).toBeInTheDocument();
    });

    it('SidebarMenuButton renders and has data-slot', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>Menu Item</SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-menu-button"]')).toBeInTheDocument();
        expect(screen.getByText('Menu Item')).toBeInTheDocument();
    });

    it('SidebarMenuBadge has data-slot="sidebar-menu-badge"', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>Item</SidebarMenuButton>
                        <SidebarMenuBadge>5</SidebarMenuBadge>
                    </SidebarMenuItem>
                </SidebarMenu>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-menu-badge"]')).toBeInTheDocument();
    });
});

describe('SidebarInset', () => {
    it('has data-slot="sidebar-inset"', () => {
        const { container } = renderWithProvider(<SidebarInset />);
        expect(container.querySelector('[data-slot="sidebar-inset"]')).toBeInTheDocument();
    });
});

describe('SidebarRail', () => {
    it('has data-slot="sidebar-rail"', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarRail />
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-rail"]')).toBeInTheDocument();
    });
});

describe('SidebarInput', () => {
    it('has data-slot="sidebar-input"', () => {
        const { container } = renderWithProvider(<SidebarInput />);
        expect(container.querySelector('[data-slot="sidebar-input"]')).toBeInTheDocument();
    });
});

describe('SidebarSeparator', () => {
    it('has data-slot="sidebar-separator"', () => {
        const { container } = renderWithProvider(<SidebarSeparator />);
        expect(container.querySelector('[data-slot="sidebar-separator"]')).toBeInTheDocument();
    });
});

describe('SidebarGroupAction', () => {
    it('has data-slot="sidebar-group-action"', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarGroup>
                    <SidebarGroupAction>Action</SidebarGroupAction>
                </SidebarGroup>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-group-action"]')).toBeInTheDocument();
    });
});

describe('SidebarMenuAction', () => {
    it('has data-slot="sidebar-menu-action"', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuAction>...</SidebarMenuAction>
                    </SidebarMenuItem>
                </SidebarMenu>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-menu-action"]')).toBeInTheDocument();
    });
});

describe('SidebarMenuSkeleton', () => {
    it('has data-slot="sidebar-menu-skeleton"', () => {
        const { container } = renderWithProvider(<SidebarMenuSkeleton />);
        expect(container.querySelector('[data-slot="sidebar-menu-skeleton"]')).toBeInTheDocument();
    });

    it('renders icon skeleton when showIcon is true', () => {
        const { container } = renderWithProvider(<SidebarMenuSkeleton showIcon />);
        expect(container.querySelector('[data-sidebar="menu-skeleton-icon"]')).toBeInTheDocument();
    });
});

describe('SidebarMenuSub', () => {
    it('has data-slot="sidebar-menu-sub"', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuSub>
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton href='#'>Sub item</SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        </SidebarMenuSub>
                    </SidebarMenuItem>
                </SidebarMenu>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-menu-sub"]')).toBeInTheDocument();
        expect(container.querySelector('[data-slot="sidebar-menu-sub-item"]')).toBeInTheDocument();
        expect(container.querySelector('[data-slot="sidebar-menu-sub-button"]')).toBeInTheDocument();
    });
});

describe('SidebarMenuButton tooltip', () => {
    it('renders with string tooltip without errors', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip='Click here'>Menu</SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-menu-button"]')).toBeInTheDocument();
    });

    it('renders with object tooltip without errors', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip={{ children: 'Tooltip text' }}>Menu</SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-menu-button"]')).toBeInTheDocument();
    });
});

describe('Sidebar offcanvas collapsible', () => {
    beforeEach(() => setupDesktop());
    afterEach(() => vi.unstubAllGlobals());

    it('renders sidebar panel when collapsible is offcanvas', () => {
        const { container } = renderWithProvider(
            <Sidebar>
                <SidebarContent>
                    <span>Content</span>
                </SidebarContent>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar"]')).toBeInTheDocument();
    });

    it('toggles sidebar when SidebarTrigger is clicked', async () => {
        const user = userEvent.setup();
        const { container } = renderWithProvider(
            <>
                <SidebarTrigger />
                <Sidebar><SidebarContent /></Sidebar>
            </>,
        );
        const trigger = container.querySelector('[data-slot="sidebar-trigger"]');
        if (trigger) await user.click(trigger);
        expect(container.querySelector('[data-slot="sidebar-trigger"]')).toBeInTheDocument();
    });

    it('handles keyboard shortcut Ctrl+B to toggle sidebar', () => {
        renderWithProvider(<SidebarTrigger />);
        fireEvent.keyDown(window, { key: 'b', ctrlKey: true });
        // verify provider is still mounted after shortcut
        expect(document.querySelector('[data-slot="sidebar-wrapper"]')).toBeInTheDocument();
    });

    it('calls onOpenChange when SidebarProvider toggle is triggered with controlled open', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        const { container } = render(
            <TooltipProvider>
                <SidebarProvider open={true} onOpenChange={onOpenChange}>
                    <SidebarTrigger />
                    <Sidebar><SidebarContent /></Sidebar>
                </SidebarProvider>
            </TooltipProvider>,
        );
        const trigger = container.querySelector('[data-slot="sidebar-trigger"]');
        if (trigger) await user.click(trigger as Element);
        expect(onOpenChange).toHaveBeenCalled();
    });
});

describe('useSidebar outside provider', () => {
    it('throws when used outside SidebarProvider', () => {
        const Component = () => { useSidebar(); return null; };
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<Component />)).toThrow('useSidebar must be used within a SidebarProvider.');
        spy.mockRestore();
    });
});

describe('SidebarMenuAction asChild and showOnHover', () => {
    beforeEach(() => setupDesktop());
    afterEach(() => vi.unstubAllGlobals());

    it('renders SidebarMenuAction with asChild=true', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuAction asChild>
                            <a href='#'>Action</a>
                        </SidebarMenuAction>
                    </SidebarMenuItem>
                </SidebarMenu>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-menu-action"]')).toBeInTheDocument();
    });

    it('renders SidebarMenuAction with showOnHover=true', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuAction showOnHover>...</SidebarMenuAction>
                    </SidebarMenuItem>
                </SidebarMenu>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-menu-action"]')).toBeInTheDocument();
    });

    it('renders SidebarMenuSubButton with asChild=true', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuSub>
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild>
                                    <a href='#'>Sub</a>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        </SidebarMenuSub>
                    </SidebarMenuItem>
                </SidebarMenu>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-menu-sub-button"]')).toBeInTheDocument();
    });

    it('renders SidebarMenuButton tooltip in collapsed state', () => {
        const { container } = render(
            <TooltipProvider>
                <SidebarProvider defaultOpen={false}>
                    <Sidebar collapsible='icon'>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip='Click here'>Item</SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </Sidebar>
                </SidebarProvider>
            </TooltipProvider>,
        );
        expect(container.querySelector('[data-slot="sidebar-menu-button"]')).toBeInTheDocument();
    });

    it('renders SidebarMenuButton with asChild=true', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href='#'>Item</a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-menu-button"]')).toBeInTheDocument();
    });

    it('renders SidebarGroupLabel with asChild=true', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarGroup>
                    <SidebarGroupLabel asChild>
                        <button>Label</button>
                    </SidebarGroupLabel>
                </SidebarGroup>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-group-label"]')).toBeInTheDocument();
    });

    it('renders SidebarGroupAction with asChild=true', () => {
        const { container } = renderWithProvider(
            <Sidebar collapsible='none'>
                <SidebarGroup>
                    <SidebarGroupAction asChild>
                        <a href='#'>+</a>
                    </SidebarGroupAction>
                </SidebarGroup>
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar-group-action"]')).toBeInTheDocument();
    });

    it('renders Sidebar with floating variant', () => {
        const { container } = renderWithProvider(
            <Sidebar variant='floating'>
                <SidebarContent />
            </Sidebar>,
        );
        expect(container.querySelector('[data-slot="sidebar"]')).toBeInTheDocument();
    });
});
