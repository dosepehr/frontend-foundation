import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { InfoIcon } from 'lucide-react'
import TooltipWrapper from '.'
import Button from '../Button'

const meta: Meta<typeof TooltipWrapper> = {
    title: 'UI/Tooltip',
    component: TooltipWrapper,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        content: {
            control: 'text',
            description: 'Content shown inside the tooltip',
        },
        variant: {
            control: 'select',
            options: ['default', 'primary', 'success', 'warning', 'destructive', 'info'],
            description: 'Color variant of the tooltip',
        },
        side: {
            control: 'select',
            options: ['top', 'right', 'bottom', 'left'],
            description: 'Side the tooltip appears on',
        },
        sideOffset: {
            control: 'number',
            description: 'Distance in px between trigger and tooltip',
        },
        delayDuration: {
            control: 'number',
            description: 'Delay in ms before the tooltip opens',
        },
    },
}

export default meta
type Story = StoryObj<typeof TooltipWrapper>

export const Default: Story = {
    args: {
        content: 'This is a tooltip',
        side: 'top',
        variant: 'default',
        children: <Button variant='outline'>Hover me</Button>,
    },
}

export const AllVariants: Story = {
    render: () => (
        <div className='flex flex-wrap gap-3'>
            {(['default', 'primary', 'success', 'warning', 'destructive', 'info'] as const).map((variant) => (
                <TooltipWrapper key={variant} content={variant} variant={variant}>
                    <Button variant='outline' size='sm'>
                        {variant.charAt(0).toUpperCase() + variant.slice(1)}
                    </Button>
                </TooltipWrapper>
            ))}
        </div>
    ),
    args: {},
}

export const AllSides: Story = {
    render: () => (
        <div className='grid grid-cols-3 place-items-center gap-8 p-16'>
            <div />
            <TooltipWrapper content='Top' side='top'>
                <Button variant='outline' size='sm'>Top</Button>
            </TooltipWrapper>
            <div />
            <TooltipWrapper content='Left' side='left'>
                <Button variant='outline' size='sm'>Left</Button>
            </TooltipWrapper>
            <div />
            <TooltipWrapper content='Right' side='right'>
                <Button variant='outline' size='sm'>Right</Button>
            </TooltipWrapper>
            <div />
            <TooltipWrapper content='Bottom' side='bottom'>
                <Button variant='outline' size='sm'>Bottom</Button>
            </TooltipWrapper>
            <div />
        </div>
    ),
    args: {},
}

export const WithIcon: Story = {
    args: {
        content: 'Additional information about this field',
        variant: 'info',
        side: 'top',
        children: (
            <span className='text-muted-foreground cursor-help'>
                <InfoIcon className='size-4' />
            </span>
        ),
    },
}

export const LongContent: Story = {
    args: {
        content: 'This tooltip contains a longer description that wraps across multiple lines to show how the max-width constraint works.',
        side: 'top',
        children: <Button variant='outline'>Long tooltip</Button>,
    },
}

export const WithDelay: Story = {
    args: {
        content: 'Appears with delay',
        delayDuration: 300,
        children: <Button variant='outline'>No delay</Button>,
    },
}
