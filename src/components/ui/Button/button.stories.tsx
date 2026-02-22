import { Download, Mail, Trash2 } from 'lucide-react';
import { Button } from '.';
import { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
    title: 'UI/Button',
    component: Button,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: [
                'default',
                'secondary',
                'success',
                'warning',
                'destructive',
                'outline',
                'ghost',
                'link',
                'shadow',
            ],
        },
        size: {
            control: 'select',
            options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
        },
        disabled:    { control: 'boolean' },
        isLoading:   { control: 'boolean' },
        showArrow:   { control: 'boolean' },
        loadingText: { control: 'text' },
        asChild:     { control: 'boolean' },
        children:    { control: 'text' },
    },
    args: {
        children:    'Button',
        disabled:    false,
        isLoading:   false,
        showArrow:   false,
        loadingText: 'loading...',
        asChild:     false,
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Playground — full control via Args Panel
// ─────────────────────────────────────────────
export const Playground: Story = {
    args: { variant: 'default', size: 'default', children: 'Click me' },
};

// ─────────────────────────────────────────────
// All Variants × All Text Sizes
// ─────────────────────────────────────────────
export const AllVariantsAndSizes: Story = {
    name: 'All Variants & Sizes',
    render: () => {
        const variants = [
            'default',
            'secondary',
            'destructive',
            'outline',
            'ghost',
            'link',
        ] as const;
        const sizes = ['xs', 'sm', 'default', 'lg'] as const;

        return (
            <div className='overflow-auto'>
                <table className='border-separate border-spacing-2 text-sm'>
                    <thead>
                        <tr>
                            <th className='text-muted-foreground pr-4 text-left font-normal'>
                                variant \ size
                            </th>
                            {sizes.map((s) => (
                                <th
                                    key={s}
                                    className='text-muted-foreground px-2 text-center font-normal capitalize'
                                >
                                    {s}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {variants.map((v) => (
                            <tr key={v}>
                                <td className='text-muted-foreground pr-4 capitalize'>{v}</td>
                                {sizes.map((s) => (
                                    <td key={s} className='text-center'>
                                        <Button variant={v} size={s}>
                                            Label
                                        </Button>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    },
};

// ─────────────────────────────────────────────
// All Icon Sizes
// ─────────────────────────────────────────────
export const IconSizes: Story = {
    name: 'Icon Sizes',
    render: () => (
        <div className='flex flex-wrap items-end gap-3'>
            {(['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const).map((s) => (
                <Button key={s} size={s} aria-label={s}>
                    <Download />
                </Button>
            ))}
        </div>
    ),
};

// ─────────────────────────────────────────────
// With Icons (leading / trailing)
// ─────────────────────────────────────────────
export const WithIcons: Story = {
    name: 'With Icons',
    render: () => (
        <div className='flex flex-wrap items-center gap-3'>
            <Button>
                <Mail />
                Leading icon
            </Button>
            <Button variant='outline'>
                Trailing icon
                <Download />
            </Button>
            <Button variant='secondary'>
                <Trash2 />
                Both sides
                <Download />
            </Button>
        </div>
    ),
};

// ─────────────────────────────────────────────
// showArrow prop
// ─────────────────────────────────────────────
export const WithArrow: Story = {
    name: 'Show Arrow',
    render: () => (
        <div className='flex flex-wrap items-center gap-3'>
            <Button showArrow>Continue</Button>
            <Button variant='outline' showArrow>
                Learn more
            </Button>
            <Button variant='ghost' showArrow>
                See all
            </Button>
        </div>
    ),
};

// ─────────────────────────────────────────────
// States — Disabled & Loading
// ─────────────────────────────────────────────
export const States: Story = {
    name: 'States',
    render: () => (
        <div className='flex flex-wrap items-center gap-3'>
            <Button disabled>Disabled</Button>
            <Button variant='outline' disabled>
                Disabled outline
            </Button>
            <Button isLoading>Save</Button>
            <Button isLoading loadingText='Uploading…' variant='secondary'>
                Upload
            </Button>
            <Button isLoading size='icon' aria-label='Loading' />
        </div>
    ),
};

