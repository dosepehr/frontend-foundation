import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
    HomeIcon,
    FileTextIcon,
    FolderIcon,
    SettingsIcon,
    UserIcon,
    ShieldIcon,
    SlashIcon,
    ChevronRightIcon,
} from 'lucide-react';
import BreadcrumbGroup from '.';
import type { BreadcrumbItemDef } from './breadcrumb.props';

const meta: Meta<typeof BreadcrumbGroup> = {
    title: 'Components/BreadcrumbGroup',
    component: BreadcrumbGroup,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        maxItems: {
            control: { type: 'number', min: 2 },
            description:
                'حداکثر تعداد آیتم‌های قابل نمایش (مازاد با ellipsis جایگزین می‌شود)',
        },
        separator: {
            control: false,
            description: 'جداکننده سفارشی بین آیتم‌ها',
        },
        items: {
            control: false,
            description: 'آرایه‌ای از آیتم‌های breadcrumb',
        },
    },
};

export default meta;
type Story = StoryObj<typeof BreadcrumbGroup>;

// ─── Data fixtures ─────────────────────────────────────────────────────────────

const twoItems: BreadcrumbItemDef[] = [
    { label: 'Home', href: '#' },
    { label: 'Dashboard' },
];

const threeItems: BreadcrumbItemDef[] = [
    { label: 'Home', href: '#' },
    { label: 'Components', href: '#' },
    { label: 'Breadcrumb' },
];

const fiveItems: BreadcrumbItemDef[] = [
    { label: 'Home', href: '#' },
    { label: 'Dashboard', href: '#' },
    { label: 'Settings', href: '#' },
    { label: 'Account', href: '#' },
    { label: 'Security' },
];

const sixItems: BreadcrumbItemDef[] = [
    { label: 'Home', href: '#' },
    { label: 'Dashboard', href: '#' },
    { label: 'Projects', href: '#' },
    { label: 'Design System', href: '#' },
    { label: 'Components', href: '#' },
    { label: 'Breadcrumb' },
];

const withIconItems: BreadcrumbItemDef[] = [
    { label: 'Home', href: '#', icon: HomeIcon },
    { label: 'Projects', href: '#', icon: FolderIcon },
    { label: 'Report.pdf', icon: FileTextIcon },
];

const withAllIconItems: BreadcrumbItemDef[] = [
    { label: 'Home', href: '#', icon: HomeIcon },
    { label: 'Settings', href: '#', icon: SettingsIcon },
    { label: 'Account', href: '#', icon: UserIcon },
    { label: 'Security', href: '#', icon: ShieldIcon },
    { label: 'Two-Factor Auth', icon: ShieldIcon },
];

// ─── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
    args: {
        items: threeItems,
    },
};

export const TwoItems: Story = {
    args: {
        items: twoItems,
    },
};

export const SingleItem: Story = {
    args: {
        items: [{ label: 'Home' }],
    },
};

export const LongPath: Story = {
    args: {
        items: fiveItems,
    },
};

export const WithIcons: Story = {
    args: {
        items: withIconItems,
    },
};

export const WithAllIcons: Story = {
    args: {
        items: withAllIconItems,
    },
};

export const CollapsedMaxThree: Story = {
    name: 'Collapsed — maxItems: 3',
    args: {
        items: sixItems,
        maxItems: 3,
    },
};

export const CollapsedMaxFour: Story = {
    name: 'Collapsed — maxItems: 4',
    args: {
        items: sixItems,
        maxItems: 4,
    },
};

export const CollapsedWithIcons: Story = {
    name: 'Collapsed — With Icons',
    args: {
        items: withAllIconItems,
        maxItems: 3,
    },
};

export const CustomSeparatorSlash: Story = {
    name: 'Custom Separator — Slash Icon',
    args: {
        items: threeItems,
        separator: <SlashIcon className='size-3.5' />,
    },
};

export const CustomSeparatorText: Story = {
    name: 'Custom Separator — Text /',
    args: {
        items: threeItems,
        separator: <span className='text-xs text-muted-foreground'>/</span>,
    },
};

export const CustomSeparatorArrow: Story = {
    name: 'Custom Separator — ChevronRight',
    args: {
        items: fiveItems,
        separator: <ChevronRightIcon className='size-3.5' />,
    },
};

export const CollapsedCustomSeparator: Story = {
    name: 'Collapsed — Custom Separator',
    args: {
        items: sixItems,
        maxItems: 3,
        separator: <SlashIcon className='size-3.5' />,
    },
};

export const MaxItemsEqualToLength: Story = {
    name: 'maxItems === items.length (no collapse)',
    args: {
        items: threeItems,
        maxItems: 3,
    },
};

export const MaxItemsGreaterThanLength: Story = {
    name: 'maxItems > items.length (no collapse)',
    args: {
        items: threeItems,
        maxItems: 10,
    },
};

export const AllVariants: Story = {
    name: 'All Variants — Overview',
    render: () => (
        <div className='flex flex-col gap-6 min-w-[480px]'>
            <div className='flex flex-col gap-1.5'>
                <span className='text-xs text-muted-foreground font-medium'>
                    Default (3 items)
                </span>
                <BreadcrumbGroup items={threeItems} />
            </div>

            <div className='flex flex-col gap-1.5'>
                <span className='text-xs text-muted-foreground font-medium'>
                    Long Path (5 items)
                </span>
                <BreadcrumbGroup items={fiveItems} />
            </div>

            <div className='flex flex-col gap-1.5'>
                <span className='text-xs text-muted-foreground font-medium'>
                    With Icons
                </span>
                <BreadcrumbGroup items={withIconItems} />
            </div>

            <div className='flex flex-col gap-1.5'>
                <span className='text-xs text-muted-foreground font-medium'>
                    Collapsed — maxItems: 3
                </span>
                <BreadcrumbGroup items={sixItems} maxItems={3} />
            </div>

            <div className='flex flex-col gap-1.5'>
                <span className='text-xs text-muted-foreground font-medium'>
                    Collapsed — maxItems: 4
                </span>
                <BreadcrumbGroup items={sixItems} maxItems={4} />
            </div>

            <div className='flex flex-col gap-1.5'>
                <span className='text-xs text-muted-foreground font-medium'>
                    Custom Separator — Slash
                </span>
                <BreadcrumbGroup
                    items={threeItems}
                    separator={<SlashIcon className='size-3.5' />}
                />
            </div>

            <div className='flex flex-col gap-1.5'>
                <span className='text-xs text-muted-foreground font-medium'>
                    Collapsed + Custom Separator
                </span>
                <BreadcrumbGroup
                    items={sixItems}
                    maxItems={3}
                    separator={<SlashIcon className='size-3.5' />}
                />
            </div>
        </div>
    ),
};

