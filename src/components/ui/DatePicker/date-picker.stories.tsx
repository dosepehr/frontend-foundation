import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { addDays, startOfToday } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import DatePicker from '.';
import { ControlledDatePicker } from '../../controlled/ControlledDatePicker';
import { Button } from '../Button/components';

const meta: Meta<typeof DatePicker> = {
    title: 'UI/DatePicker',
    component: DatePicker,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    argTypes: {
        placeholder: { control: 'text' },
        label: { control: 'text' },
        description: { control: 'text' },
        error: { control: 'text' },
        required: { control: 'boolean' },
        disabled: { control: 'boolean' },
        format: { control: 'text' },
    },
    decorators: [
        (Story) => (
            <div className="w-72">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
    args: {
        placeholder: 'Pick a date',
    },
};

export const WithLabel: Story = {
    args: {
        label: 'Date of birth',
        placeholder: 'Pick a date',
        required: true,
    },
};

export const WithDescription: Story = {
    args: {
        label: 'Appointment date',
        description: 'Select the date for your appointment.',
        placeholder: 'Pick a date',
    },
};

export const WithError: Story = {
    args: {
        label: 'Start date',
        placeholder: 'Pick a date',
        error: 'Please select a valid date.',
        required: true,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Date',
        placeholder: 'Pick a date',
        disabled: true,
    },
};

export const WithDisabledDates: Story = {
    args: {
        label: 'Available from',
        placeholder: 'Pick a date',
        description: 'Past dates are not available.',
        disabledDates: { before: startOfToday() },
    },
};

export const CustomFormat: Story = {
    args: {
        label: 'Date',
        placeholder: 'Pick a date',
        format: 'dd/MM/yyyy',
    },
};

export const WithStartAddon: Story = {
    args: {
        label: 'Event date',
        placeholder: 'Pick a date',
        startAddon: <CalendarIcon className="size-4" />,
    },
};

// ─── Controlled ───────────────────────────────────────────────────────────────

export const Controlled: Story = {
    render: () => {
        const [date, setDate] = React.useState<Date | undefined>();
        return (
            <div className="flex flex-col gap-4">
                <DatePicker
                    label="Select date"
                    placeholder="Pick a date"
                    value={date}
                    onChange={setDate}
                />
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDate(startOfToday())}
                    >
                        Today
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDate(addDays(startOfToday(), 7))}
                    >
                        +7 days
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDate(undefined)}
                    >
                        Clear
                    </Button>
                </div>
                {date && (
                    <p className="text-sm text-muted-foreground">
                        Selected: {date.toLocaleDateString()}
                    </p>
                )}
            </div>
        );
    },
};

// ─── React Hook Form + Zod ────────────────────────────────────────────────────

const schema = z.object({
    startDate: z.date({ error: 'Start date is required.' }),
    endDate: z
        .date({ error: 'End date is required.' })
        .refine((d) => d > startOfToday(), {
            message: 'End date must be in the future.',
        }),
});

type FormValues = z.infer<typeof schema>;

export const WithReactHookForm: Story = {
    render: () => {
        const {
            control,
            handleSubmit,
            formState: { isSubmitSuccessful },
            reset,
        } = useForm<FormValues>({ resolver: zodResolver(schema) });

        return (
            <form
                onSubmit={handleSubmit(() => {})}
                className="flex w-72 flex-col gap-4"
            >
                <ControlledDatePicker
                    control={control}
                    name="startDate"
                    label="Start date"
                    placeholder="Pick a date"
                    required
                />
                <ControlledDatePicker
                    control={control}
                    name="endDate"
                    label="End date"
                    placeholder="Pick a date"
                    required
                    disabledDates={{ before: addDays(startOfToday(), 1) }}
                />
                <div className="flex gap-2">
                    <Button type="submit" size="sm">
                        Submit
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => reset()}
                    >
                        Reset
                    </Button>
                </div>
                {isSubmitSuccessful && (
                    <p className="text-sm text-success">
                        Form submitted successfully.
                    </p>
                )}
            </form>
        );
    },
};

export const ControlledOpen: Story = {
    render: () => {
        const [date, setDate] = React.useState<Date | undefined>();
        const [open, setOpen] = React.useState(false);
        return (
            <div className="flex flex-col gap-4">
                <DatePicker
                    label="Date"
                    placeholder="Pick a date"
                    value={date}
                    onChange={(d) => {
                        setDate(d);
                        setOpen(false);
                    }}
                    open={open}
                    onOpenChange={setOpen}
                />
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpen(true)}
                >
                    Open picker programmatically
                </Button>
            </div>
        );
    },
};
