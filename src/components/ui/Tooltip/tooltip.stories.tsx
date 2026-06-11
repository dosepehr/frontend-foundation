import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { InfoIcon } from 'lucide-react'
import TooltipWrapper from '.'
import ButtonWrapper from '../Button'

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
        children: <ButtonWrapper variant='outline'>Hover me</ButtonWrapper>,
    },
}

export const AllVariants: Story = {
    render: () => (
        <div className='flex flex-wrap gap-3'>
            {(['default', 'primary', 'success', 'warning', 'destructive', 'info'] as const).map((variant) => (
                <TooltipWrapper key={variant} content={variant} variant={variant}>
                    <ButtonWrapper variant='outline' size='sm'>
                        {variant.charAt(0).toUpperCase() + variant.slice(1)}
                    </ButtonWrapper>
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
                <ButtonWrapper variant='outline' size='sm'>Top</ButtonWrapper>
            </TooltipWrapper>
            <div />
            <TooltipWrapper content='Left' side='left'>
                <ButtonWrapper variant='outline' size='sm'>Left</ButtonWrapper>
            </TooltipWrapper>
            <div />
            <TooltipWrapper content='Right' side='right'>
                <ButtonWrapper variant='outline' size='sm'>Right</ButtonWrapper>
            </TooltipWrapper>
            <div />
            <TooltipWrapper content='Bottom' side='bottom'>
                <ButtonWrapper variant='outline' size='sm'>Bottom</ButtonWrapper>
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
        children: <ButtonWrapper variant='outline'>Long tooltip</ButtonWrapper>,
    },
}

export const WithDelay: Story = {
    args: {
        content: 'Appears with delay',
        delayDuration: 300,
        children: <ButtonWrapper variant='outline'>No delay</ButtonWrapper>,
    },
}
