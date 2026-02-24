import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';
import { Checkbox } from '.';
import { Label } from '../Label';

const meta: Meta<typeof Checkbox> = {
    title: 'Components/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        checked: {
            control: 'select',
            options: [true, false, 'indeterminate'],
            description: 'وضعیت چک‌باکس',
        },
        disabled: {
            control: 'boolean',
            description: 'غیرفعال بودن چک‌باکس',
        },
        required: {
            control: 'boolean',
            description: 'اجباری بودن فیلد',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// ─── Single Checkbox ────────────────────────────────────────────────────────────

export const Default: Story = {
    render: (args) => <Checkbox {...args} />,
};

export const Checked: Story = {
    render: (args) => <Checkbox defaultChecked {...args} />,
};

export const Indeterminate: Story = {
    render: (args) => <Checkbox checked='indeterminate' {...args} />,
};

export const Disabled: Story = {
    render: (args) => <Checkbox disabled {...args} />,
};

export const DisabledChecked: Story = {
    name: 'Disabled — Checked',
    render: (args) => <Checkbox disabled defaultChecked {...args} />,
};

export const DisabledIndeterminate: Story = {
    name: 'Disabled — Indeterminate',
    render: (args) => <Checkbox disabled checked='indeterminate' {...args} />,
};

// ─── With Label ─────────────────────────────────────────────────────────────────

export const WithLabel: Story = {
    name: 'With Label',
    render: (args) => (
        <div className='flex items-center gap-2'>
            <Checkbox id='with-label' {...args} />
            <Label htmlFor='with-label'>Accept terms and conditions</Label>
        </div>
    ),
};

export const WithLabelChecked: Story = {
    name: 'With Label — Checked',
    render: (args) => (
        <div className='flex items-center gap-2'>
            <Checkbox id='with-label-checked' defaultChecked {...args} />
            <Label htmlFor='with-label-checked'>
                Accept terms and conditions
            </Label>
        </div>
    ),
};

export const WithLabelDisabled: Story = {
    name: 'With Label — Disabled',
    render: (args) => (
        <div className='group flex items-center gap-2' data-disabled='true'>
            <Checkbox id='with-label-disabled' disabled {...args} />
            <Label htmlFor='with-label-disabled'>
                This option is unavailable
            </Label>
        </div>
    ),
};

export const WithLabelDisabledChecked: Story = {
    name: 'With Label — Disabled Checked',
    render: (args) => (
        <div className='group flex items-center gap-2' data-disabled='true'>
            <Checkbox
                id='with-label-disabled-checked'
                disabled
                defaultChecked
                {...args}
            />
            <Label htmlFor='with-label-disabled-checked'>
                This option is unavailable
            </Label>
        </div>
    ),
};

export const WithDescription: Story = {
    name: 'With Label + Description',
    render: (args) => (
        <div className='flex gap-2'>
            <Checkbox id='with-desc' className='mt-0.5' {...args} />
            <div className='flex flex-col gap-1'>
                <Label htmlFor='with-desc'>Marketing emails</Label>
                <p className='text-muted-foreground text-sm'>
                    Receive emails about new products, features, and more.
                </p>
            </div>
        </div>
    ),
};

export const WithDescriptionChecked: Story = {
    name: 'With Label + Description — Checked',
    render: (args) => (
        <div className='flex gap-2'>
            <Checkbox
                id='with-desc-checked'
                defaultChecked
                className='mt-0.5'
                {...args}
            />
            <div className='flex flex-col gap-1'>
                <Label htmlFor='with-desc-checked'>Marketing emails</Label>
                <p className='text-muted-foreground text-sm'>
                    Receive emails about new products, features, and more.
                </p>
            </div>
        </div>
    ),
};

export const WithDescriptionDisabled: Story = {
    name: 'With Label + Description — Disabled',
    render: (args) => (
        <div className='group flex gap-2' data-disabled='true'>
            <Checkbox
                id='with-desc-disabled'
                disabled
                className='mt-0.5'
                {...args}
            />
            <div className='flex flex-col gap-1'>
                <Label htmlFor='with-desc-disabled'>Marketing emails</Label>
                <p className='text-muted-foreground text-sm'>
                    Receive emails about new products, features, and more.
                </p>
            </div>
        </div>
    ),
};

// ─── Controlled ────────────────────────────────────────────────────────────────

export const Controlled: Story = {
    render: () => {
        const [checked, setChecked] = React.useState<boolean | 'indeterminate'>(
            false
        );

        return (
            <div className='flex flex-col gap-4 items-start'>
                <div className='flex items-center gap-2'>
                    <Checkbox
                        id='controlled'
                        checked={checked}
                        onCheckedChange={setChecked}
                    />
                    <Label htmlFor='controlled'>
                        {checked === 'indeterminate'
                            ? 'Indeterminate'
                            : checked
                            ? 'Checked'
                            : 'Unchecked'}
                    </Label>
                </div>

                <div className='flex gap-2'>
                    <button
                        onClick={() => setChecked(true)}
                        className='text-xs px-2 py-1 rounded border border-border hover:bg-muted transition-colors'
                    >
                        Check
                    </button>
                    <button
                        onClick={() => setChecked(false)}
                        className='text-xs px-2 py-1 rounded border border-border hover:bg-muted transition-colors'
                    >
                        Uncheck
                    </button>
                    <button
                        onClick={() => setChecked('indeterminate')}
                        className='text-xs px-2 py-1 rounded border border-border hover:bg-muted transition-colors'
                    >
                        Indeterminate
                    </button>
                </div>
            </div>
        );
    },
};

// ─── Group ─────────────────────────────────────────────────────────────────────

export const CheckboxGroup: Story = {
    name: 'Checkbox Group',
    render: () => {
        const options = [
            { id: 'html', label: 'HTML' },
            { id: 'css', label: 'CSS' },
            { id: 'javascript', label: 'JavaScript' },
            { id: 'typescript', label: 'TypeScript' },
        ];

        const [selected, setSelected] = React.useState<string[]>(['html']);

        const toggle = (id: string) =>
            setSelected((prev) =>
                prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
            );

        return (
            <div className='flex flex-col gap-3'>
                <Label className='text-base font-semibold'>
                    Select your skills
                </Label>
                {options.map((option) => (
                    <div key={option.id} className='flex items-center gap-2'>
                        <Checkbox
                            id={option.id}
                            checked={selected.includes(option.id)}
                            onCheckedChange={() => toggle(option.id)}
                        />
                        <Label htmlFor={option.id}>{option.label}</Label>
                    </div>
                ))}
                <p className='text-muted-foreground text-xs mt-1'>
                    Selected: {selected.join(', ') || 'none'}
                </p>
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

        const toggleAll = () => setSelected(allChecked ? [] : items);

        const toggleItem = (item: string) =>
            setSelected((prev) =>
                prev.includes(item)
                    ? prev.filter((s) => s !== item)
                    : [...prev, item]
            );

        return (
            <div className='flex flex-col gap-3'>
                <div className='flex items-center gap-2'>
                    <Checkbox
                        id='select-all'
                        checked={
                            allChecked
                                ? true
                                : someChecked
                                ? 'indeterminate'
                                : false
                        }
                        onCheckedChange={toggleAll}
                    />
                    <Label htmlFor='select-all' className='font-semibold'>
                        Select all
                    </Label>
                </div>

                <div className='flex flex-col gap-2 pl-6 border-l border-border ml-2'>
                    {items.map((item) => (
                        <div key={item} className='flex items-center gap-2'>
                            <Checkbox
                                id={item}
                                checked={selected.includes(item)}
                                onCheckedChange={() => toggleItem(item)}
                            />
                            <Label htmlFor={item}>{item}</Label>
                        </div>
                    ))}
                </div>
            </div>
        );
    },
};

// ─── All States Overview ────────────────────────────────────────────────────────

export const AllStates: Story = {
    name: 'All States — Overview',
    render: () => {
        const rows: Array<{
            label: string;
            checked: boolean | 'indeterminate';
            disabled?: boolean;
        }> = [
            { label: 'Unchecked', checked: false },
            { label: 'Checked', checked: true },
            { label: 'Indeterminate', checked: 'indeterminate' },
            { label: 'Disabled — Unchecked', checked: false, disabled: true },
            { label: 'Disabled — Checked', checked: true, disabled: true },
            {
                label: 'Disabled — Indeterminate',
                checked: 'indeterminate',
                disabled: true,
            },
        ];

        return (
            <div className='flex flex-col gap-3 min-w-[260px]'>
                {rows.map((row, i) => (
                    <div
                        key={i}
                        className={`flex items-center gap-2 ${
                            row.disabled ? 'group' : ''
                        }`}
                        data-disabled={row.disabled ? 'true' : undefined}
                    >
                        <Checkbox
                            id={`state-${i}`}
                            checked={row.checked}
                            disabled={row.disabled}
                        />
                        <Label htmlFor={`state-${i}`}>{row.label}</Label>
                    </div>
                ))}
            </div>
        );
    },
};

