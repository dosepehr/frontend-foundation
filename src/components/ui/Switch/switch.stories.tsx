import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Switch } from '.';


const meta: Meta<typeof Switch> = {
    title: 'Components/Switch',
    component: Switch,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        variant: {
            control: 'select',
            options: [
                'default',
                'secondary',
                'success',
                'info',
                'warning',
                'destructive',
            ],
            description: 'Controls the color of the switch when checked.',
            table: {
                type: {
                    summary:
                        "'default' | 'secondary' | 'success' | 'info' | 'warning' | 'destructive'",
                },
                defaultValue: { summary: 'default' },
            },
        },
        size: {
            control: 'radio',
            options: ['sm', 'default'],
            description: 'Controls the size of the switch.',
            table: {
                type: { summary: "'sm' | 'default'" },
                defaultValue: { summary: 'default' },
            },
        },
        label: {
            control: 'text',
            description:
                'Optional label text rendered next to the switch. Uses the Label component and is linked via htmlFor.',
            table: {
                type: { summary: 'string' },
            },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the switch, preventing user interaction.',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
        checked: {
            control: 'boolean',
            description: 'Controls the checked state (controlled mode).',
            table: {
                type: { summary: 'boolean' },
            },
        },
        defaultChecked: {
            control: 'boolean',
            description: 'Sets the initial checked state (uncontrolled mode).',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
        onCheckedChange: {
            action: 'checkedChange',
            description: 'Callback fired when the checked state changes.',
            table: {
                type: { summary: '(checked: boolean) => void' },
            },
        },
    },
    args: {
        variant: 'default',
        size: 'default',
        disabled: false,
        defaultChecked: false,
    },
};

export default meta;
type Story = StoryObj<typeof Switch>;


export const Default: Story = {
    args: {
        id: 'switch-default',
        label: 'Enable notifications',
        defaultChecked: true,
    },
};

export const Unchecked: Story = {
    args: {
        id: 'switch-unchecked',
        label: 'Enable notifications',
        defaultChecked: false,
    },
};

export const WithoutLabel: Story = {
    args: {
        id: 'switch-without-label',
        defaultChecked: true,
    },
};

export const Small: Story = {
    args: {
        id: 'switch-small',
        size: 'sm',
        label: 'Compact mode',
        defaultChecked: true,
    },
};

export const Disabled: Story = {
    args: {
        id: 'switch-disabled',
        label: 'This option is unavailable',
        disabled: true,
        defaultChecked: false,
    },
};

export const DisabledChecked: Story = {
    name: 'Disabled (Checked)',
    args: {
        id: 'switch-disabled-checked',
        label: 'This option is unavailable',
        disabled: true,
        defaultChecked: true,
    },
};


export const Secondary: Story = {
    args: {
        id: 'switch-secondary',
        variant: 'secondary',
        label: 'Secondary',
        defaultChecked: true,
    },
};

export const Success: Story = {
    args: {
        id: 'switch-success',
        variant: 'success',
        label: 'Active',
        defaultChecked: true,
    },
};

export const Info: Story = {
    args: {
        id: 'switch-info',
        variant: 'info',
        label: 'Informational',
        defaultChecked: true,
    },
};

export const Warning: Story = {
    args: {
        id: 'switch-warning',
        variant: 'warning',
        label: 'Proceed with caution',
        defaultChecked: true,
    },
};

export const Destructive: Story = {
    args: {
        id: 'switch-destructive',
        variant: 'destructive',
        label: 'Delete all data on logout',
        defaultChecked: true,
    },
};


export const AllVariants: Story = {
    parameters: {
        controls: { disable: true },
    },
    render: () => (
        <div className='flex flex-col gap-4'>
            {(
                [
                    ['default', 'Default'],
                    ['secondary', 'Secondary'],
                    ['success', 'Success'],
                    ['info', 'Info'],
                    ['warning', 'Warning'],
                    ['destructive', 'Destructive'],
                ] as const
            ).map(([variant, label]) => (
                <Switch
                    key={variant}
                    id={`switch-all-variants-${variant}`}
                    variant={variant}
                    label={label}
                    defaultChecked
                />
            ))}
        </div>
    ),
};


export const AllSizes: Story = {
    parameters: {
        controls: { disable: true },
    },
    render: () => (
        <div className='flex flex-col gap-4'>
            <Switch
                id='switch-size-default'
                size='default'
                label='Default size'
                defaultChecked
            />
            <Switch
                id='switch-size-sm'
                size='sm'
                label='Small size'
                defaultChecked
            />
        </div>
    ),
};

