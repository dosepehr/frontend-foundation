import FormPreview from '@/stories/helpers/FormPreview';
import { toIsoDay } from '@/utils/funcs/filterParsers';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ControlledDatePicker } from '.';

const schema = z.object({ date: z.date({ error: 'Select a date' }) });
type FormValues = z.infer<typeof schema>;

const Demo = ({
    validate = false,
    jalali = false,
}: {
    validate?: boolean;
    jalali?: boolean;
}) => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { date: undefined },
        resolver: validate ? zodResolver(schema) : undefined,
    });
    const [submitted, setSubmitted] = useState<unknown>(null);

    return (
        <FormPreview
            // Jalali shows the payload a backend gets: the Gregorian day.
            onSubmit={handleSubmit(({ date }) =>
                setSubmitted(
                    jalali ? { date: date && toIsoDay(date) } : { date },
                ),
            )}
            submitted={submitted}
        >
            <ControlledDatePicker
                name="date"
                control={control}
                label={jalali ? 'تاریخ نوبت' : 'Appointment'}
                placeholder={
                    jalali ? 'تاریخ نوبت را انتخاب کنید' : 'Select the date'
                }
                calendar={jalali ? 'jalali' : 'gregorian'}
                required
            />
        </FormPreview>
    );
};

const meta: Meta<typeof ControlledDatePicker> = {
    title: 'Controlled/DatePicker',
    component: ControlledDatePicker,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ControlledDatePicker>;

export const Default: Story = {
    render: () => <Demo />,
};

export const WithValidation: Story = {
    render: () => <Demo validate />,
};

export const Jalali: Story = {
    globals: { i18n: 'fa-IR' },
    render: () => (
        <div dir="rtl">
            <Demo jalali />
        </div>
    ),
};
