import FormPreview from '@/stories/helpers/FormPreview';
import { toIsoDay } from '@/utils/funcs/filterParsers';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ControlledDateRangePicker } from '.';

const schema = z.object({
    stay: z
        .custom<DateRange>()
        .optional()
        .refine((range) => !!range?.to, 'Pick both dates'),
});
type FormValues = z.infer<typeof schema>;

const Demo = ({
    validate = false,
    jalali = false,
}: {
    validate?: boolean;
    jalali?: boolean;
}) => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: {},
        resolver: validate ? zodResolver(schema) : undefined,
    });
    const [submitted, setSubmitted] = useState<unknown>(null);

    return (
        <FormPreview
            // Jalali shows the payload a backend gets: Gregorian days.
            onSubmit={handleSubmit(({ stay }) =>
                setSubmitted(
                    jalali
                        ? {
                              from: stay?.from && toIsoDay(stay.from),
                              to: stay?.to && toIsoDay(stay.to),
                          }
                        : { stay },
                ),
            )}
            submitted={submitted}
        >
            <ControlledDateRangePicker
                name="stay"
                control={control}
                label={jalali ? 'تاریخ اقامت' : 'Stay'}
                placeholder={
                    jalali ? 'تاریخ اقامت را انتخاب کنید' : 'Select the dates'
                }
                calendar={jalali ? 'jalali' : 'gregorian'}
                required
            />
        </FormPreview>
    );
};

const meta: Meta<typeof ControlledDateRangePicker> = {
    title: 'Controlled/DateRangePicker',
    component: ControlledDateRangePicker,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ControlledDateRangePicker>;

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
            <Demo validate jalali />
        </div>
    ),
};
