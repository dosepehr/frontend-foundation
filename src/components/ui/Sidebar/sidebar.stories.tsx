import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';
import {
    ChevronRight,
    LayoutDashboard,
    LayoutGrid,
    Users,
    Calendar,
    Settings,
    MessageCircle,
    FileText,
    Ticket,
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarProvider,
    SidebarTrigger,
    useSidebar,
} from './components';
import { ScrollArea } from '../ScrollArea/components';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '../Collapsible/components';
import { TooltipProvider } from '../Tooltip/components';

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
        icon: <LayoutDashboard className='size-4.5!' />,
        href: '/dashboard',
        isActive: true,
    },
    {
        title: 'Patients',
        icon: <Users className='size-4.5!' />,
        children: [
            { title: 'Patient List', href: '/patients' },
            { title: 'Add New Patient', href: '/patients/new' },
        ],
    },
    {
        title: 'Appointments',
        icon: <Calendar className='size-4.5!' />,
        href: '/appointments',
    },
    {
        title: 'Messages',
        icon: <MessageCircle className='size-4.5!' />,
        href: '/chat',
    },
    { title: 'Tickets', icon: <Ticket className='size-4.5!' />, href: '/tickets' },
    {
        title: 'Reports',
        icon: <FileText className='size-4.5!' />,
        href: '/reports',
    },
    {
        title: 'Settings',
        icon: <Settings className='size-4.5!' />,
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
                className='group/collapsible'
            >
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                            {item.icon}
                            <span>{item.title}</span>
                            <ChevronRight className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:group-data-[state=open]/collapsible:-rotate-90' />
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
            <SidebarMenuButton tooltip={item.title} asChild isActive={item.isActive}>
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
            collapsible='icon'
            className='[--sidebar-accent:oklch(0.94_0.04_262.881)] [--sidebar-accent-foreground:oklch(0.546_0.245_262.881)] dark:[--sidebar-accent:oklch(0.3_0.06_262.881)] dark:[--sidebar-accent-foreground:oklch(0.75_0.15_262.881)]'
        >
            <SidebarHeader className='items-center justify-center py-4 w-full'>
                <div className='h-14 flex items-center justify-center'>
                    <LayoutGrid className='size-6 text-primary shrink-0' />
                    {open && (
                        <span className='text-primary font-bold text-base ms-2'>
                            MyApp
                        </span>
                    )}
                </div>
                {open && (
                    <div className='text-muted-foreground w-full text-xs h-8 flex items-center px-2'>
                        Management Dashboard
                    </div>
                )}
            </SidebarHeader>
            <SidebarContent>
                <ScrollArea className='h-full'>
                    <SidebarGroup>
                        <SidebarMenu className='gap-1'>
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
                <div className='flex h-screen w-full'>
                    <AppSidebarInner />
                    <main className='flex-1 p-6 bg-gray-50 dark:bg-neutral-900'>
                        <SidebarTrigger />
                        <p className='text-sm text-muted-foreground mt-4'>
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
                <div className='flex h-screen w-full'>
                    <AppSidebarInner />
                    <main className='flex-1 p-6 bg-gray-50 dark:bg-neutral-900'>
                        <SidebarTrigger />
                        <p className='text-sm text-muted-foreground mt-4'>
                            Main page content
                        </p>
                    </main>
                </div>
            </SidebarProvider>
        </TooltipProvider>
    ),
};

