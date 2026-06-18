import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import  Checkbox  from '.'

const meta: Meta<typeof Checkbox> = {
    title: 'UI/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'primary', 'secondary', 'success', 'warning', 'destructive'],
            description: 'Color variant of the checkbox',
        },
        label: {
            control: 'text',
            description: 'Label shown next to the checkbox',
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
            description: 'Disables the checkbox',
        },
        required: {
            control: 'boolean',
            description: 'Marks the field as required',
        },
    },
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
    args: {
        label: 'Accept terms and conditions',
    },
}

export const Checked: Story = {
    args: {
        label: 'Remember me',
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
        label: 'Pre-selected option',
        defaultChecked: true,
        disabled: true,
    },
}

export const NoLabel: Story = {
    args: {},
}

export const AllVariants: Story = {
    render: () => (
        <div className='flex flex-col gap-3'>
            {(['default', 'primary', 'secondary', 'success', 'warning', 'destructive'] as const).map((variant) => (
                <Checkbox
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
            <Checkbox label='Unchecked' />
            <Checkbox label='Checked' defaultChecked />
            <Checkbox label='Disabled' disabled />
            <Checkbox label='Disabled checked' defaultChecked disabled />
        </div>
    ),
    args: {},
}
