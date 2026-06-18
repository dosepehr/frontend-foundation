import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import  Spinner  from '.'

const meta: Meta<typeof Spinner> = {
    title: 'UI/Spinner',
    component: Spinner,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'radio',
            options: ['sm', 'default', 'lg', 'xl'],
        },
        variant: {
            control: 'select',
            options: ['default', 'primary', 'success', 'warning', 'destructive', 'info', 'inherit'],
        },
    },
}

export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = {
    args: {
        size: 'default',
        variant: 'default',
    },
}

export const AllSizes: Story = {
    render: () => (
        <div className='flex items-center gap-4'>
            {(['sm', 'default', 'lg', 'xl'] as const).map((size) => (
                <Spinner key={size} size={size} variant='primary' />
            ))}
        </div>
    ),
}

export const AllVariants: Story = {
    render: () => (
        <div className='flex items-center gap-4'>
            {(['default', 'primary', 'success', 'warning', 'destructive', 'info'] as const).map((variant) => (
                <Spinner key={variant} variant={variant} />
            ))}
        </div>
    ),
}

export const Inherit: Story = {
    render: () => (
        <div className='flex items-center gap-4'>
            <span className='text-success flex items-center gap-1.5 text-sm'>
                <Spinner size='sm' /> Loading…
            </span>
            <span className='text-destructive flex items-center gap-1.5 text-sm'>
                <Spinner size='sm' /> Retrying…
            </span>
        </div>
    ),
}
