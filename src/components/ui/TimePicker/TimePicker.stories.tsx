import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import TimePicker from '.';
import type { TimePickerProps } from './TimePicker.types';

const Controlled = (props: TimePickerProps) => {
    const [value, setValue] = useState(props.value);
    return (
        <div className="flex flex-col gap-2">
            <TimePicker {...props} value={value} onChange={setValue} />
            <p className="text-sm text-muted-foreground">
                Value: <code>{JSON.stringify(value)}</code>
            </p>
        </div>
    );
};

const meta: Meta<typeof TimePicker> = {
    title: 'UI/TimePicker',
    component: TimePicker,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className="w-72">
                <Story />
            </div>
        ),
    ],
    render: (args) => <Controlled {...args} />,
    argTypes: {
        label: { control: 'text' },
        description: { control: 'text' },
        error: { control: 'text' },
        hourCycle: { control: 'inline-radio', options: [24, 12] },
        showSeconds: { control: 'boolean' },
        minuteStep: { control: 'number' },
        clearable: { control: 'boolean' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
    },
    args: { label: 'Start time', placeholder: 'Select the start time' },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const body = within(canvasElement.ownerDocument.body);
        await userEvent.click(canvas.getByRole('button', { expanded: false }));
        const content = await body.findByRole('listbox', { name: 'Hours' });
        // Wait for the open animation to finish.
        await waitFor(() => expect(content).toBeVisible());
    },
};

export const WithValue: Story = {
    args: { value: '09:30' },
};

export const TwelveHour: Story = {
    args: { hourCycle: 12, value: '18:45' },
};

export const WithSeconds: Story = {
    args: { showSeconds: true, value: '12:00:30' },
};

export const QuarterHours: Story = {
    args: {
        label: 'Meeting time',
        description: 'Meetings start on the quarter hour.',
        minuteStep: 15,
    },
};

export const Invalid: Story = {
    args: { error: 'Pick a start time.', required: true },
};

export const Disabled: Story = {
    args: { value: '09:30', disabled: true },
};

export const RightToLeft: Story = {
    // Persian page: lang sets the Estedad font, dir the direction (also for portals).
    globals: { i18n: 'fa-IR' },
    render: (args) => (
        <div dir="rtl">
            <Controlled {...args} />
        </div>
    ),
    args: {
        label: 'ساعت شروع',
        placeholder: 'ساعت شروع را انتخاب کنید',
        clearLabel: 'پاک کردن',
        value: '08:15',
    },
};
