import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from '.'

const meta: Meta<typeof Calendar> = {
    title: 'UI/Calendar',
    component: Calendar,
    tags: ['autodocs'],
    argTypes: {
        captionLayout: {
            control: 'select',
            options: ['label', 'dropdown', 'dropdown-months', 'dropdown-years'],
            description: 'Caption layout style',
        },
        showOutsideDays: {
            control: 'boolean',
            description: 'Show days from adjacent months',
        },
        showWeekNumber: {
            control: 'boolean',
            description: 'Show ISO week numbers',
        },
        disabled: {
            control: false,
        },
    },
    parameters: {
        layout: 'centered',
    },
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
    args: {
        mode: 'single',
        captionLayout: 'label',
        showOutsideDays: true,
    },
}

export const WithDropdownCaption: Story = {
    args: {
        mode: 'single',
        captionLayout: 'dropdown',
        startMonth: new Date(2020, 0),
        endMonth: new Date(2030, 11),
        showOutsideDays: true,
    },
}

export const SinglePicker: Story = {
    render: (args) => {
        const [date, setDate] = useState<Date | undefined>(new Date())
        return (
            <div className='flex flex-col items-center gap-4'>
                <Calendar
                    {...args}
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                />
                <p className='text-sm text-muted-foreground'>
                    {date ? date.toLocaleDateString() : 'No date selected'}
                </p>
            </div>
        )
    },
    args: {
        captionLayout: 'label',
        showOutsideDays: true,
    },
}

export const RangePicker: Story = {
    render: (args) => {
        const [range, setRange] = useState<DateRange | undefined>()
        return (
            <div className='flex flex-col items-center gap-4'>
                <Calendar
                    {...args}
                    mode='range'
                    selected={range}
                    onSelect={setRange}
                    numberOfMonths={2}
                />
                <p className='text-sm text-muted-foreground'>
                    {range?.from
                        ? range.to
                            ? `${range.from.toLocaleDateString()} → ${range.to.toLocaleDateString()}`
                            : range.from.toLocaleDateString()
                        : 'Select a range'}
                </p>
            </div>
        )
    },
    args: {
        captionLayout: 'label',
        showOutsideDays: true,
    },
}

export const MultiplePicker: Story = {
    render: (args) => {
        const [dates, setDates] = useState<Date[] | undefined>()
        return (
            <div className='flex flex-col items-center gap-4'>
                <Calendar
                    {...args}
                    mode='multiple'
                    selected={dates}
                    onSelect={setDates}
                />
                <p className='text-sm text-muted-foreground'>
                    {dates?.length
                        ? `${dates.length} day${dates.length > 1 ? 's' : ''} selected`
                        : 'Select multiple days'}
                </p>
            </div>
        )
    },
    args: {
        captionLayout: 'label',
        showOutsideDays: true,
    },
}

export const WithDisabledDates: Story = {
    render: (args) => {
        const [date, setDate] = useState<Date | undefined>()
        const today = new Date()
        const disablePast = { before: today }
        return (
            <Calendar
                {...args}
                mode='single'
                selected={date}
                onSelect={setDate}
                disabled={disablePast}
            />
        )
    },
    args: {
        captionLayout: 'label',
        showOutsideDays: true,
    },
}

export const WithWeekNumbers: Story = {
    args: {
        mode: 'single',
        showWeekNumber: true,
        showOutsideDays: true,
    },
}

export const TwoMonths: Story = {
    args: {
        mode: 'single',
        numberOfMonths: 2,
        showOutsideDays: true,
        captionLayout: 'label',
    },
}
