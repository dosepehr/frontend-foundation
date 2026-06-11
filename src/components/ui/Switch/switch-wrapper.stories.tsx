import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import SwitchWrapper from '.'

const meta: Meta<typeof SwitchWrapper> = {
    title: 'UI/SwitchWrapper',
    component: SwitchWrapper,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'success', 'warning', 'destructive', 'info'],
            description: 'Color variant of the switch and card border/background',
        },
        size: {
            control: 'radio',
            options: ['default', 'sm'],
            description: 'Size of the switch',
        },
        label: {
            control: 'text',
            description: 'Label text shown next to the switch',
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
            description: 'Disables the switch and dims the card',
        },
        required: {
            control: 'boolean',
            description: 'Shows an asterisk next to the label',
        },
    },
}

export default meta
type Story = StoryObj<typeof SwitchWrapper>

export const Default: Story = {
    args: {
        label: 'Enable notifications',
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
        label: 'Dark mode',
        description: 'Switch the interface to dark theme.',
        defaultChecked: true,
    },
}

export const Required: Story = {
    args: {
        label: 'Accept data processing',
        description: 'Required to continue using the service.',
        required: true,
    },
}

export const Disabled: Story = {
    args: {
        label: 'Two-factor authentication',
        description: 'Contact your admin to change this setting.',
        disabled: true,
    },
}

export const DisabledChecked: Story = {
    args: {
        label: 'Mandatory setting',
        description: 'This setting is enforced by your organization.',
        defaultChecked: true,
        disabled: true,
    },
}

export const AllVariants: Story = {
    render: () => (
        <div className='flex flex-col gap-3'>
            {(['default', 'success', 'warning', 'destructive', 'info'] as const).map((variant) => (
                <SwitchWrapper
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
            {(['default', 'success', 'warning', 'destructive', 'info'] as const).map((variant) => (
                <SwitchWrapper
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
            <SwitchWrapper
                variant='default'
                label='Push notifications'
                description='Receive push notifications on your device.'
                defaultChecked
            />
            <SwitchWrapper
                variant='default'
                label='Marketing emails'
                description='Receive emails about new products and promotions.'
            />
            <SwitchWrapper
                variant='default'
                label='SMS alerts'
                description='Get order updates via text message.'
            />
            <SwitchWrapper
                variant='default'
                label='Two-factor authentication'
                description='Enforced by your organization. Contact admin to change.'
                disabled
            />
        </div>
    ),
    args: {},
}
