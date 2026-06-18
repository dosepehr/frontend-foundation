import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    Sidebar,
    SidebarProvider,
    SidebarTrigger,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuBadge,
    SidebarInset,
    SidebarSeparator,
} from './components';

function renderWithProvider(ui: React.ReactNode) {
    return render(<SidebarProvider>{ui}</SidebarProvider>);
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
