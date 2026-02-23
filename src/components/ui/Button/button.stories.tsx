import { ArrowRightCircle, Download, Mail, Trash2 } from 'lucide-react';
import { Button } from '.';
import { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
    title: 'COMPONENTS/Button',
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
            options: [
                'default',
                'xs',
                'sm',
                'lg',
                'icon',
                'icon-xs',
                'icon-sm',
                'icon-lg',
            ],
        },
        disabled: { control: 'boolean' },
        isLoading: { control: 'boolean' },
        showArrow: { control: 'boolean' },
        loadingText: { control: 'text' },
        asChild: { control: 'boolean' },
        children: { control: 'text' },
    },
    args: {
        children: 'Button',
        disabled: false,
        isLoading: false,
        showArrow: false,
        loadingText: 'loading...',
        asChild: false,
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: { variant: 'default', size: 'default', children: 'Click me' },
};

export const AllSizes: Story = {
    render: () => {
        const sizes = [
            'xs',
            'sm',
            'default',
            'lg',
            'icon-xs',
            'icon-sm',
            'icon',
            'icon-lg',
        ] as const;

        return (
            <div className='flex items-center gap-2 flex-wrap'>
                {sizes.map((s) => (
                    <Button key={s} variant='outline' size={s}>
                        {s.startsWith('icon') ? <ArrowRightCircle /> : s}
                    </Button>
                ))}
            </div>
        );
    },
};
export const AllVariants: Story = {
    render: () => {
        const variants = [
            'default',
            'secondary',
            'destructive',
            'outline',
            'ghost',
            'link',
        ] as const;

        return (
            <div className='flex items-center gap-2 flex-wrap'>
                {variants.map((v) => (
                    <Button key={v} variant={v} size='default'>
                        {v}
                    </Button>
                ))}
            </div>
        );
    },
};

export const IconSizes: Story = {
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

export const WithIcons: Story = {
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

export const States: Story = {
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
            <Button isLoading size='icon' aria-label='Loading' loadingText='' />
        </div>
    ),
};

