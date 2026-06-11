import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import RadioGroupWrapper from '.'

const planOptions = [
    { value: 'starter', label: 'Starter', description: 'Perfect for side projects and small apps.' },
    { value: 'pro', label: 'Pro', description: 'For growing teams and production workloads.' },
    { value: 'enterprise', label: 'Enterprise', description: 'Custom pricing for large organizations.' },
]

const simpleOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
    { value: 'maybe', label: 'Maybe' },
]

const meta: Meta<typeof RadioGroupWrapper> = {
    title: 'UI/RadioGroupWrapper',
    component: RadioGroupWrapper,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'success', 'warning', 'destructive', 'info'],
            description: 'Color variant of the radio items and card border/background',
        },
        orientation: {
            control: 'radio',
            options: ['vertical', 'horizontal'],
            description: 'Direction the options are stacked',
        },
        disabled: {
            control: 'boolean',
            description: 'Disables all options',
        },
        required: {
            control: 'boolean',
            description: 'Shows an asterisk next to each option label',
        },
        options: {
            control: 'object',
            description: 'Array of radio options',
        },
    },
}

export default meta
type Story = StoryObj<typeof RadioGroupWrapper>

export const Default: Story = {
    args: {
        options: simpleOptions,
        defaultValue: 'yes',
    },
}

export const WithDescriptions: Story = {
    args: {
        options: planOptions,
        defaultValue: 'pro',
    },
}

export const Required: Story = {
    args: {
        options: planOptions,
        required: true,
    },
}

export const Disabled: Story = {
    args: {
        options: simpleOptions,
        defaultValue: 'yes',
        disabled: true,
    },
}

export const PartiallyDisabled: Story = {
    args: {
        options: [
            { value: 'starter', label: 'Starter', description: 'Available plan.' },
            { value: 'pro', label: 'Pro', description: 'Currently unavailable.', disabled: true },
            { value: 'enterprise', label: 'Enterprise', description: 'Contact sales.' },
        ],
        defaultValue: 'starter',
    },
}

export const Horizontal: Story = {
    args: {
        options: simpleOptions,
        defaultValue: 'yes',
        orientation: 'horizontal',
    },
}

export const AllVariants: Story = {
    render: () => (
        <div className='flex flex-col gap-6'>
            {(['default', 'success', 'warning', 'destructive', 'info'] as const).map((variant) => (
                <RadioGroupWrapper
                    key={variant}
                    variant={variant}
                    defaultValue='yes'
                    options={[
                        { value: 'yes', label: variant.charAt(0).toUpperCase() + variant.slice(1), description: 'Helper text for this option.' },
                        { value: 'no', label: 'Unchecked option', description: 'Hover to see the tinted background.' },
                    ]}
                />
            ))}
        </div>
    ),
    args: {},
}

export const AllVariantsUnchecked: Story = {
    render: () => (
        <div className='flex flex-col gap-6'>
            {(['default', 'success', 'warning', 'destructive', 'info'] as const).map((variant) => (
                <RadioGroupWrapper
                    key={variant}
                    variant={variant}
                    options={[
                        { value: 'one', label: variant.charAt(0).toUpperCase() + variant.slice(1), description: 'Hover to see the tinted background.' },
                        { value: 'two', label: 'Second option' },
                    ]}
                />
            ))}
        </div>
    ),
    args: {},
}
