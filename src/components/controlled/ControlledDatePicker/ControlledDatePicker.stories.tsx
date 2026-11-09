import FormPreview from '@/stories/helpers/FormPreview';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ControlledDatePicker } from '.';

const schema = z.object({ date: z.date({ error: 'Select a date' }) });
type FormValues = z.infer<typeof schema>;

const Demo = ({ validate = false }: { validate?: boolean }) => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { date: undefined },
        resolver: validate ? zodResolver(schema) : undefined,
    });
    const [submitted, setSubmitted] = useState<FormValues | null>(null);

    return (
        <FormPreview
            onSubmit={handleSubmit(setSubmitted)}
            submitted={submitted}
        >
            <ControlledDatePicker
                name="date"
                control={control}
                label="Appointment"
                placeholder="Select the date"
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
