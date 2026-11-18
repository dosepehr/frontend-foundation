import FormPreview from '@/stories/helpers/FormPreview';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ControlledTimePicker } from '.';

const schema = z.object({
    start: z
        .string()
        .optional()
        .refine((value) => !!value, 'Select the start time'),
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
            <ControlledTimePicker
                name="start"
                control={control}
                label="Start time"
                placeholder="Select the start time"
                minuteStep={5}
                clearable
                required
            />
        </FormPreview>
    );
};

const meta: Meta<typeof ControlledTimePicker> = {
    title: 'Controlled/TimePicker',
    component: ControlledTimePicker,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ControlledTimePicker>;

export const Default: Story = {
    render: () => <Demo />,
};

export const WithValidation: Story = {
    render: () => <Demo validate />,
};
