import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RadioGroup, RadioGroupItem } from '.'

const meta: Meta<typeof RadioGroupItem> = {
    title: 'UI/RadioGroup',
    component: RadioGroupItem,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'success', 'warning', 'destructive', 'info'],
            description: 'Color of the radio item when checked',
        },
        label: {
            control: 'text',
            description: 'Label shown next to the radio item',
        },
        disabled: {
            control: 'boolean',
            description: 'Disables this item',
        },
    },
}

export default meta
type Story = StoryObj<typeof RadioGroupItem>

export const Default: Story = {
    render: () => (
        <RadioGroup defaultValue='one'>
            <RadioGroupItem value='one' label='Option one' />
            <RadioGroupItem value='two' label='Option two' />
            <RadioGroupItem value='three' label='Option three' />
        </RadioGroup>
    ),
    args: {},
}

export const NoLabel: Story = {
    render: () => (
        <RadioGroup defaultValue='a'>
            <RadioGroupItem value='a' />
            <RadioGroupItem value='b' />
            <RadioGroupItem value='c' />
        </RadioGroup>
    ),
    args: {},
}

export const Disabled: Story = {
    render: () => (
        <RadioGroup defaultValue='one'>
            <RadioGroupItem value='one' label='Available option' />
            <RadioGroupItem value='two' label='Disabled option' disabled />
            <RadioGroupItem value='three' label='Another option' />
        </RadioGroup>
    ),
    args: {},
}

export const AllVariants: Story = {
    render: () => (
        <div className='flex flex-col gap-6'>
            {(['default', 'success', 'warning', 'destructive', 'info'] as const).map((variant) => (
                <RadioGroup key={variant} defaultValue='checked'>
                    <RadioGroupItem value='checked' variant={variant} label={`${variant.charAt(0).toUpperCase() + variant.slice(1)} checked`} />
                    <RadioGroupItem value='unchecked' variant={variant} label={`${variant.charAt(0).toUpperCase() + variant.slice(1)} unchecked`} />
                </RadioGroup>
            ))}
        </div>
    ),
    args: {},
}

export const Horizontal: Story = {
    render: () => (
        <RadioGroup defaultValue='sm' orientation='horizontal' className='flex gap-4'>
            <RadioGroupItem value='sm' label='Small' />
            <RadioGroupItem value='md' label='Medium' />
            <RadioGroupItem value='lg' label='Large' />
        </RadioGroup>
    ),
    args: {},
}
