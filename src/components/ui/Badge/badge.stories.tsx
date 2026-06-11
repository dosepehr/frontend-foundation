import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CheckIcon, InfoIcon, AlertTriangleIcon, XCircleIcon, StarIcon } from 'lucide-react'
import { Badge } from '.'

const meta: Meta<typeof Badge> = {
    title: 'UI/Badge',
    component: Badge,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'secondary', 'destructive', 'success', 'warning', 'info', 'outline', 'ghost', 'link'],
            description: 'Color intent of the badge',
        },
        appearance: {
            control: 'radio',
            options: ['solid', 'soft'],
            description: 'Visual weight — solid fills with the color, soft uses a tinted background',
        },
        children: {
            control: 'text',
            description: 'Badge label',
        },
        asChild: {
            control: 'boolean',
            description: 'Renders as child element via Radix Slot',
        },
    },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
    args: {
        variant: 'default',
        appearance: 'soft',
        children: 'Badge',
    },
}

export const SoftVariants: Story = {
    render: () => (
        <div className='flex flex-wrap gap-2'>
            {(['default', 'secondary', 'destructive', 'success', 'warning', 'info', 'outline', 'ghost'] as const).map((variant) => (
                <Badge key={variant} variant={variant} appearance='soft'>
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Badge>
            ))}
        </div>
    ),
    args: {},
}

export const SolidVariants: Story = {
    render: () => (
        <div className='flex flex-wrap gap-2'>
            {(['default', 'secondary', 'destructive', 'success', 'warning', 'info'] as const).map((variant) => (
                <Badge key={variant} variant={variant} appearance='solid'>
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Badge>
            ))}
        </div>
    ),
    args: {},
}

export const AppearanceComparison: Story = {
    render: () => (
        <div className='flex flex-col gap-4'>
            {(['default', 'destructive', 'success', 'warning', 'info'] as const).map((variant) => (
                <div key={variant} className='flex items-center gap-3'>
                    <span className='w-24 text-xs text-muted-foreground capitalize'>{variant}</span>
                    <Badge variant={variant} appearance='soft'>{variant} soft</Badge>
                    <Badge variant={variant} appearance='solid'>{variant} solid</Badge>
                </div>
            ))}
        </div>
    ),
    args: {},
}

export const WithIcon: Story = {
    render: () => (
        <div className='flex flex-wrap gap-2'>
            <Badge variant='success' appearance='soft'><CheckIcon />Completed</Badge>
            <Badge variant='info' appearance='soft'><InfoIcon />In Review</Badge>
            <Badge variant='warning' appearance='soft'><AlertTriangleIcon />Pending</Badge>
            <Badge variant='destructive' appearance='soft'><XCircleIcon />Failed</Badge>
            <Badge variant='default' appearance='solid'><StarIcon />Featured</Badge>
        </div>
    ),
    args: {},
}

export const Success: Story = {
    args: {
        variant: 'success',
        appearance: 'soft',
        children: 'Completed',
    },
}

export const Warning: Story = {
    args: {
        variant: 'warning',
        appearance: 'soft',
        children: 'Pending',
    },
}

export const Destructive: Story = {
    args: {
        variant: 'destructive',
        appearance: 'soft',
        children: 'Failed',
    },
}

export const Info: Story = {
    args: {
        variant: 'info',
        appearance: 'soft',
        children: 'In Review',
    },
}

export const Outline: Story = {
    args: {
        variant: 'outline',
        children: 'Outline',
    },
}
