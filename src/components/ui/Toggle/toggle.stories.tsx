import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { BoldIcon, ItalicIcon, UnderlineIcon, StarIcon, BookmarkIcon } from 'lucide-react'
import { Toggle } from '.'

const meta: Meta<typeof Toggle> = {
    title: 'UI/Toggle',
    component: Toggle,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'outline', 'primary', 'success', 'warning', 'destructive', 'info'],
            description: 'Visual style of the toggle',
        },
        size: {
            control: 'radio',
            options: ['sm', 'default', 'lg'],
            description: 'Size of the toggle',
        },
        pressed: {
            control: 'boolean',
            description: 'Controlled pressed state',
        },
        defaultPressed: {
            control: 'boolean',
            description: 'Initial pressed state (uncontrolled)',
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the toggle',
        },
        children: {
            control: 'text',
            description: 'Toggle label or icon',
        },
    },
}

export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
    args: {
        children: 'Toggle',
        variant: 'default',
        size: 'default',
    },
}

export const Outline: Story = {
    args: {
        children: 'Outline',
        variant: 'outline',
    },
}

export const Pressed: Story = {
    args: {
        children: 'Pressed',
        defaultPressed: true,
    },
}

export const Disabled: Story = {
    args: {
        children: 'Disabled',
        disabled: true,
    },
}

export const WithIcon: Story = {
    args: {
        children: <BoldIcon />,
        variant: 'outline',
        size: 'default',
    },
}

export const AllVariants: Story = {
    render: () => (
        <div className='flex flex-wrap gap-2'>
            {(['default', 'outline', 'primary', 'success', 'warning', 'destructive', 'info'] as const).map((variant) => (
                <Toggle key={variant} variant={variant} defaultPressed>
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Toggle>
            ))}
        </div>
    ),
    args: {},
}

export const AllVariantsUnpressed: Story = {
    render: () => (
        <div className='flex flex-wrap gap-2'>
            {(['default', 'outline', 'primary', 'success', 'warning', 'destructive', 'info'] as const).map((variant) => (
                <Toggle key={variant} variant={variant}>
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Toggle>
            ))}
        </div>
    ),
    args: {},
}

export const AllSizes: Story = {
    render: () => (
        <div className='flex items-center gap-2'>
            {(['sm', 'default', 'lg'] as const).map((size) => (
                <Toggle key={size} size={size} variant='outline' defaultPressed>
                    {size}
                </Toggle>
            ))}
        </div>
    ),
    args: {},
}

export const IconToggles: Story = {
    render: () => (
        <div className='flex items-center gap-2'>
            <Toggle variant='outline' defaultPressed><BoldIcon /></Toggle>
            <Toggle variant='outline'><ItalicIcon /></Toggle>
            <Toggle variant='outline'><UnderlineIcon /></Toggle>
        </div>
    ),
    args: {},
}

export const WithIconAndText: Story = {
    render: () => (
        <div className='flex items-center gap-2'>
            <Toggle variant='outline' defaultPressed><StarIcon />Starred</Toggle>
            <Toggle variant='primary'><StarIcon />Favorite</Toggle>
            <Toggle aria-label='Toggle bookmark' size='sm' variant='outline'>
                <BookmarkIcon className='group-data-[state=on]/toggle:fill-foreground' />
                Bookmark
            </Toggle>
        </div>
    ),
    args: {},
}
