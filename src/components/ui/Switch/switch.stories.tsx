import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Switch } from '.'

const meta: Meta<typeof Switch> = {
    title: 'UI/Switch',
    component: Switch,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'success', 'warning', 'destructive', 'info'],
            description: 'Color of the track when checked',
        },
        size: {
            control: 'radio',
            options: ['default', 'sm'],
            description: 'Size of the switch',
        },
        label: {
            control: 'text',
            description: 'Label shown next to the switch',
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
            description: 'Disables the switch',
        },
        required: {
            control: 'boolean',
            description: 'Marks the field as required',
        },
    },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
    args: {
        label: 'Enable notifications',
    },
}

export const Checked: Story = {
    args: {
        label: 'Enabled by default',
        defaultChecked: true,
    },
}

export const Disabled: Story = {
    args: {
        label: 'Unavailable option',
        disabled: true,
    },
}

export const DisabledChecked: Story = {
    args: {
        label: 'Locked setting',
        defaultChecked: true,
        disabled: true,
    },
}

export const Small: Story = {
    args: {
        label: 'Small switch',
        size: 'sm',
    },
}

export const NoLabel: Story = {
    args: {},
}

export const AllVariants: Story = {
    render: () => (
        <div className='flex flex-col gap-3'>
            {(['default', 'success', 'warning', 'destructive', 'info'] as const).map((variant) => (
                <Switch
                    key={variant}
                    variant={variant}
                    label={variant.charAt(0).toUpperCase() + variant.slice(1)}
                    defaultChecked
                />
            ))}
        </div>
    ),
    args: {},
}

export const States: Story = {
    render: () => (
        <div className='flex flex-col gap-3'>
            <Switch label='Unchecked' />
            <Switch label='Checked' defaultChecked />
            <Switch label='Disabled' disabled />
            <Switch label='Disabled checked' defaultChecked disabled />
        </div>
    ),
    args: {},
}

export const Sizes: Story = {
    render: () => (
        <div className='flex flex-col gap-3'>
            <Switch label='Default size' size='default' defaultChecked />
            <Switch label='Small size' size='sm' defaultChecked />
        </div>
    ),
    args: {},
}
