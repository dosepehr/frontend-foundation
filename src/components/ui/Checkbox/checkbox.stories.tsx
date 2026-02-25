import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';
import { Checkbox } from '.';

const meta: Meta<typeof Checkbox> = {
    title: 'Components/Checkbox',
    component: Checkbox,
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
            description: 'Visual variant of the checkbox',
        },
        checked: {
            control: 'select',
            options: [true, false, 'indeterminate'],
            description: 'Checked state of the checkbox',
        },
        disabled: {
            control: 'boolean',
            description: 'Whether the checkbox is disabled',
        },
        required: {
            control: 'boolean',
            description: 'Whether the field is required',
        },
        label: {
            control: 'text',
            description: 'Label text rendered next to the checkbox',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
    args: { label: 'Accept terms and conditions', id: 'checkbox-1' },
};

export const Checked: Story = {
    args: { label: 'Accept terms and conditions', defaultChecked: true ,id: 'checkbox-2' },
};

export const Indeterminate: Story = {
    args: { label: 'Select all', checked: 'indeterminate',id: 'checkbox-3'  },
};

export const Disabled: Story = {
    args: { label: 'This option is unavailable', disabled: true,id: 'checkbox-4'  },
};

export const DisabledChecked: Story = {
    name: 'Disabled — Checked',
    args: {
        label: 'This option is unavailable',
        disabled: true,
        defaultChecked: true,
        id: 'checkbox' 
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className='flex flex-col gap-3'>
            {(
                [
                    'default',
                    'secondary',
                    'success',
                    'info',
                    'warning',
                    'destructive',
                ] as const
            ).map((variant) => (
                <Checkbox
                    id={variant}
                    key={variant}
                    variant={variant}
                    defaultChecked
                    label={variant.charAt(0).toUpperCase() + variant.slice(1)}
                />
            ))}
        </div>
    ),
};


export const Group: Story = {
    name: 'Checkbox Group',
    render: () => {
        const options = ['HTML', 'CSS', 'JavaScript', 'TypeScript'];
        const [selected, setSelected] = React.useState<string[]>(['HTML']);

        const toggle = (item: string) =>
            setSelected((prev) =>
                prev.includes(item)
                    ? prev.filter((s) => s !== item)
                    : [...prev, item]
            );

        return (
            <div className='flex flex-col gap-3'>
                {options.map((option) => (
                    <Checkbox
                        id={option}
                        key={option}
                        label={option}
                        checked={selected.includes(option)}
                        onCheckedChange={() => toggle(option)}
                    />
                ))}
            </div>
        );
    },
};

export const SelectAll: Story = {
    name: 'Select All — Indeterminate',
    render: () => {
        const items = ['Item one', 'Item two', 'Item three'];
        const [selected, setSelected] = React.useState<string[]>([]);

        const allChecked = selected.length === items.length;
        const someChecked = selected.length > 0 && !allChecked;

        return (
            <div className='flex flex-col gap-3'>
                <Checkbox
                    id={'all'}
                    label='Select all'
                    checked={
                        allChecked
                            ? true
                            : someChecked
                            ? 'indeterminate'
                            : false
                    }
                    onCheckedChange={() => setSelected(allChecked ? [] : items)}
                    className='font-semibold'
                />
                <div className='flex flex-col gap-2 pl-6 border-l border-border ml-2'>
                    {items.map((item) => (
                        <Checkbox
                            id={item}
                            key={item}
                            label={item}
                            checked={selected.includes(item)}
                            onCheckedChange={() =>
                                setSelected((prev) =>
                                    prev.includes(item)
                                        ? prev.filter((s) => s !== item)
                                        : [...prev, item]
                                )
                            }
                        />
                    ))}
                </div>
            </div>
        );
    },
};

