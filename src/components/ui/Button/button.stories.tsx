import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Button from '.'

const meta: Meta<typeof Button> = {
    title: 'UI/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'success', 'warning', 'info', 'link'],
            description: 'Visual style of the button',
        },
        size: {
            control: 'select',
            options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
            description: 'Size of the button',
        },
        children: {
            control: 'text',
            description: 'Button label',
        },
        isLoading: {
            control: 'boolean',
            description: 'Shows a spinner and loading text',
        },
        loadingText: {
            control: 'text',
            description: 'Text shown while loading',
        },
        showArrow: {
            control: 'boolean',
            description: 'Shows an arrow icon that animates on hover',
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the button',
        },
        asChild: {
            control: 'boolean',
            description: 'Renders as child element via Radix Slot',
        },
    },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
    args: {
        variant: 'default',
        size: 'default',
        children: 'Button',
    },
}

export const AllVariants: Story = {
    render: () => (
        <div className='flex flex-wrap gap-3'>
            {(['default', 'outline', 'secondary', 'ghost', 'destructive', 'success', 'warning', 'info', 'link'] as const).map((variant) => (
                <Button key={variant} variant={variant}>
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Button>
            ))}
        </div>
    ),
    args: {},
}

export const Success: Story = {
    args: {
        variant: 'success',
        children: 'Save Changes',
    },
}

export const Warning: Story = {
    args: {
        variant: 'warning',
        children: 'Proceed with Caution',
    },
}

export const Info: Story = {
    args: {
        variant: 'info',
        children: 'Learn More',
    },
}

export const AllSizes: Story = {
    render: () => (
        <div className='flex flex-wrap items-center gap-3'>
            {(['xs', 'sm', 'default', 'lg'] as const).map((size) => (
                <Button key={size} size={size}>
                    {size}
                </Button>
            ))}
        </div>
    ),
    args: {},
}

export const IconSizes: Story = {
    render: () => (
        <div className='flex flex-wrap items-center gap-3'>
            {(['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const).map((size) => (
                <Button key={size} size={size} variant='outline'>
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><line x1='6' y1='3' x2='6' y2='15'/><circle cx='18' cy='6' r='3'/><circle cx='6' cy='18' r='3'/><path d='M18 9a9 9 0 0 1-9 9'/></svg>
                </Button>
            ))}
        </div>
    ),
    args: {},
}

export const WithIcon: Story = {
    render: () => (
        <div className='flex flex-wrap items-center gap-3'>
            <Button variant='outline' size='sm'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><line x1='6' y1='3' x2='6' y2='15'/><circle cx='18' cy='6' r='3'/><circle cx='6' cy='18' r='3'/><path d='M18 9a9 9 0 0 1-9 9'/></svg>
                New Branch
            </Button>
            <Button variant='default' size='default'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><line x1='12' y1='5' x2='12' y2='19'/><line x1='5' y1='12' x2='19' y2='12'/></svg>
                New Item
            </Button>
            <Button variant='destructive' size='sm'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><polyline points='3 6 5 6 21 6'/><path d='M19 6l-1 14H6L5 6'/><path d='M10 11v6'/><path d='M14 11v6'/><path d='M9 6V4h6v2'/></svg>
                Delete
            </Button>
            <Button variant='secondary' size='lg'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/><polyline points='17 8 12 3 7 8'/><line x1='12' y1='3' x2='12' y2='15'/></svg>
                Upload
            </Button>
        </div>
    ),
    args: {},
}

export const Loading: Story = {
    args: {
        isLoading: true,
        loadingText: 'در حال دریافت',
        children: 'Submit',
    },
}

export const WithArrow: Story = {
    args: {
        showArrow: true,
        children: 'Continue',
    },
}

export const Disabled: Story = {
    args: {
        disabled: true,
        children: 'Disabled',
    },
}
