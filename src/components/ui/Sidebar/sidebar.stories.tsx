import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
    Calendar,
    ChevronRight,
    FileText,
    LayoutDashboard,
    LayoutGrid,
    MessageCircle,
    Settings,
    Ticket,
    Users,
} from 'lucide-react';
import * as React from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '../Collapsible/components';
import { ScrollArea } from '../ScrollArea/components';
import { TooltipProvider } from '../Tooltip/components';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarProvider,
    SidebarTrigger,
    useSidebar,
} from './components';

const meta = {
    title: 'UI/Sidebar',
    tags: ['autodocs'],
    parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface NavItem {
    title: string;
    icon?: React.ReactNode;
    href?: string;
    isActive?: boolean;
    children?: NavItem[];
}

const navItems: NavItem[] = [
    {
        title: 'Dashboard',
        icon: <LayoutDashboard className="size-4.5!" />,
        href: '/dashboard',
        isActive: true,
    },
    {
        title: 'Patients',
        icon: <Users className="size-4.5!" />,
        children: [
            { title: 'Patient List', href: '/patients' },
            { title: 'Add New Patient', href: '/patients/new' },
        ],
    },
    {
        title: 'Appointments',
        icon: <Calendar className="size-4.5!" />,
        href: '/appointments',
    },
    {
        title: 'Messages',
        icon: <MessageCircle className="size-4.5!" />,
        href: '/chat',
    },
    {
        title: 'Tickets',
        icon: <Ticket className="size-4.5!" />,
        href: '/tickets',
    },
    {
        title: 'Reports',
        icon: <FileText className="size-4.5!" />,
        href: '/reports',
    },
    {
        title: 'Settings',
        icon: <Settings className="size-4.5!" />,
        href: '/settings',
    },
];

function NavItemComponent({
    item,
    isSubItem = false,
}: {
    item: NavItem;
    isSubItem?: boolean;
}) {
    const hasChildren = item.children && item.children.length > 0;

    if (isSubItem && !hasChildren) {
        return (
            <SidebarMenuSubButton asChild isActive={item.isActive}>
                <a href={item.href || '#'}>
                    <span>{item.title}</span>
                </a>
            </SidebarMenuSubButton>
        );
    }

    if (hasChildren) {
        return (
            <Collapsible
                asChild
                defaultOpen={false}
                className="group/collapsible"
            >
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                            {item.icon}
                            <span>{item.title}</span>
                            <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:group-data-[state=open]/collapsible:-rotate-90" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {item.children?.map((child) => (
                                <NavItemComponent
                                    key={child.title}
                                    item={child}
                                    isSubItem
                                />
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        );
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={item.isActive}
            >
                <a href={item.href || '#'}>
                    {item.icon}
                    <span>{item.title}</span>
                </a>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

function AppSidebarInner() {
    const { open } = useSidebar();

    return (
        <Sidebar
            collapsible="icon"
            className="[--sidebar-accent-foreground:oklch(0.546_0.245_262.881)] [--sidebar-accent:oklch(0.94_0.04_262.881)] dark:[--sidebar-accent-foreground:oklch(0.75_0.15_262.881)] dark:[--sidebar-accent:oklch(0.3_0.06_262.881)]"
        >
            <SidebarHeader className="w-full items-center justify-center py-4">
                <div className="flex h-14 items-center justify-center">
                    <LayoutGrid className="size-6 shrink-0 text-primary" />
                    {open && (
                        <span className="ms-2 text-base font-bold text-primary">
                            MyApp
                        </span>
                    )}
                </div>
                {open && (
                    <div className="flex h-8 w-full items-center px-2 text-xs text-muted-foreground">
                        Management Dashboard
                    </div>
                )}
            </SidebarHeader>
            <SidebarContent>
                <ScrollArea className="h-full">
                    <SidebarGroup>
                        <SidebarMenu className="gap-1">
                            {navItems.map((item) => (
                                <NavItemComponent
                                    key={item.title}
                                    item={item}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </ScrollArea>
            </SidebarContent>
        </Sidebar>
    );
}

export const AppSidebar: Story = {
    render: () => (
        <TooltipProvider>
            <SidebarProvider defaultOpen={true}>
                <div className="flex h-screen w-full">
                    <AppSidebarInner />
                    <main className="flex-1 bg-gray-50 p-6 dark:bg-neutral-900">
                        <SidebarTrigger />
                        <p className="mt-4 text-sm text-muted-foreground">
                            Main page content
                        </p>
                    </main>
                </div>
            </SidebarProvider>
        </TooltipProvider>
    ),
};

export const AppSidebarCollapsed: Story = {
    render: () => (
        <TooltipProvider>
            <SidebarProvider defaultOpen={false}>
                <div className="flex h-screen w-full">
                    <AppSidebarInner />
                    <main className="flex-1 bg-gray-50 p-6 dark:bg-neutral-900">
                        <SidebarTrigger />
                        <p className="mt-4 text-sm text-muted-foreground">
                            Main page content
                        </p>
                    </main>
                </div>
            </SidebarProvider>
        </TooltipProvider>
    ),
};
