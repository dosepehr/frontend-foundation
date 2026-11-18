import FormPreview from '@/stories/helpers/FormPreview';
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

const Demo = ({ validate = false }: { validate?: boolean }) => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: {},
        resolver: validate ? zodResolver(schema) : undefined,
    });
    const [submitted, setSubmitted] = useState<FormValues | null>(null);

    return (
        <FormPreview
            onSubmit={handleSubmit(setSubmitted)}
            submitted={submitted}
        >
            <ControlledDateRangePicker
                name="stay"
                control={control}
                label="Stay"
                placeholder="Select the dates"
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
