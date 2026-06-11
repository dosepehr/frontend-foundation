import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import CheckboxWrapper from '.'

const meta: Meta<typeof CheckboxWrapper> = {
    title: 'UI/CheckboxWrapper',
    component: CheckboxWrapper,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'primary', 'secondary', 'success', 'warning', 'destructive'],
            description: 'Color variant of the checkbox and card border/background',
        },
        label: {
            control: 'text',
            description: 'Label text shown next to the checkbox',
        },
        description: {
            control: 'text',
            description: 'Helper text shown below the label',
        },
        checked: {
            control: 'boolean',
            description: 'Controlled checked state',
        },
        defaultChecked: {
            control: 'boolean',
            description: 'Initial checked state (uncontrolled)',
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the checkbox and dims the card',
        },
        required: {
            control: 'boolean',
            description: 'Shows an asterisk next to the label',
        },
    },
}

export default meta
type Story = StoryObj<typeof CheckboxWrapper>

export const Default: Story = {
    args: {
        label: 'Accept terms and conditions',
    },
}

export const WithDescription: Story = {
    args: {
        label: 'Marketing emails',
        description: 'Receive emails about new products, features, and promotions.',
    },
}

export const Checked: Story = {
    args: {
        label: 'Remember me',
        defaultChecked: true,
    },
}

export const Required: Story = {
    args: {
        label: 'I agree to the terms of service',
        description: 'You must accept before continuing.',
        required: true,
    },
}

export const Disabled: Story = {
    args: {
        label: 'This option is unavailable',
        description: 'Contact support to enable this feature.',
        disabled: true,
    },
}

export const DisabledChecked: Story = {
    args: {
        label: 'Required agreement',
        description: 'This has been pre-accepted and cannot be changed.',
        defaultChecked: true,
        disabled: true,
    },
}

export const AllVariants: Story = {
    render: () => (
        <div className='flex flex-col gap-3'>
            {(['default', 'primary', 'secondary', 'success', 'warning', 'destructive'] as const).map((variant) => (
                <CheckboxWrapper
                    key={variant}
                    variant={variant}
                    label={variant.charAt(0).toUpperCase() + variant.slice(1)}
                    description='Helper text for this option.'
                    defaultChecked
                />
            ))}
        </div>
    ),
    args: {},
}

export const AllVariantsUnchecked: Story = {
    render: () => (
        <div className='flex flex-col gap-3'>
            {(['default', 'primary', 'secondary', 'success', 'warning', 'destructive'] as const).map((variant) => (
                <CheckboxWrapper
                    key={variant}
                    variant={variant}
                    label={variant.charAt(0).toUpperCase() + variant.slice(1)}
                    description='Hover to see the tinted background.'
                />
            ))}
        </div>
    ),
    args: {},
}

export const Group: Story = {
    render: () => (
        <div className='flex flex-col gap-3'>
            <CheckboxWrapper
                variant='primary'
                label='Push notifications'
                description='Receive push notifications on your device.'
                defaultChecked
            />
            <CheckboxWrapper
                variant='primary'
                label='Marketing emails'
                description='Receive emails about new products and promotions.'
            />
            <CheckboxWrapper
                variant='primary'
                label='SMS alerts'
                description='Get order updates via text message.'
            />
            <CheckboxWrapper
                variant='primary'
                label='Partner offers'
                description='Offers from our partners. Currently unavailable.'
                disabled
            />
        </div>
    ),
    args: {},
}
