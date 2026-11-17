import { faIR, getDateLib } from '@daypicker/persian';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { addDays } from 'date-fns';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import DateRangePicker from '.';
import type { DateRangePickerProps } from './DateRangePicker.types';

const Controlled = (props: DateRangePickerProps) => {
    const [value, setValue] = useState<DateRange | undefined>(props.value);
    return <DateRangePicker {...props} value={value} onChange={setValue} />;
};

const today = new Date();

const meta: Meta<typeof DateRangePicker> = {
    title: 'UI/DateRangePicker',
    component: DateRangePicker,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
    render: (args) => <Controlled {...args} />,
    argTypes: {
        label: { control: 'text' },
        description: { control: 'text' },
        error: { control: 'text' },
        numberOfMonths: { control: 'number' },
        closeOnSelect: { control: 'boolean' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
    },
    args: { label: 'Dates', placeholder: 'Select the dates' },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const body = within(canvasElement.ownerDocument.body);
        await userEvent.click(canvas.getByRole('button', { expanded: false }));
        const content = await body
            .findAllByRole('grid')
            .then((grids) => grids[0]);
        // Wait for the open animation to finish.
        await waitFor(() => expect(content).toBeVisible());
    },
};

export const WithValue: Story = {
    args: { value: { from: today, to: addDays(today, 6) } },
};

export const SingleMonth: Story = {
    args: { numberOfMonths: 1 },
};

export const FutureOnly: Story = {
    args: {
        label: 'Booking',
        description: 'Past days are disabled; stays are 2–14 nights.',
        disabledDates: { before: today },
        minDays: 2,
        maxDays: 14,
    },
};

export const CustomFormat: Story = {
    args: {
        format: 'yyyy-MM-dd',
        value: { from: today, to: addDays(today, 3) },
    },
};

export const StaysOpen: Story = {
    args: {
        closeOnSelect: false,
        description: 'Close the popover yourself after picking.',
    },
};

export const Invalid: Story = {
    args: { error: 'Choose your dates.', required: true },
};

export const Disabled: Story = {
    args: { value: { from: today, to: addDays(today, 2) }, disabled: true },
};

// Jalali (Persian) calendar via the @daypicker/persian add-on.
const jalaliCalendar = {
    dateLib: getDateLib({ locale: faIR, numerals: 'arabext' }),
    locale: faIR,
    dir: 'rtl' as const,
    numerals: 'arabext' as const,
};

export const JalaliCalendar: Story = {
    // Persian page: lang sets the Estedad font, dir the direction (also for portals).
    globals: { i18n: 'fa-IR' },
    render: (args) => (
        <div dir="rtl">
            <Controlled {...args} />
        </div>
    ),
    args: {
        label: 'تاریخ سفر',
        placeholder: 'تاریخ سفر را انتخاب کنید',
        description: 'تقویم شمسی؛ تاریخ رفت و برگشت را انتخاب کنید.',
        format: 'd LLLL y',
        calendarProps: jalaliCalendar,
        value: { from: today, to: addDays(today, 4) },
    },
};
