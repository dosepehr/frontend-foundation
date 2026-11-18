import FormPreview from '@/stories/helpers/FormPreview';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ControlledRating } from '.';

const schema = z.object({
    score: z.number().min(1, 'Rate your stay'),
});
type FormValues = z.infer<typeof schema>;

const Demo = ({ validate = false }: { validate?: boolean }) => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { score: 0 },
        resolver: validate ? zodResolver(schema) : undefined,
    });
    const [submitted, setSubmitted] = useState<FormValues | null>(null);

    return (
        <FormPreview
            onSubmit={handleSubmit(setSubmitted)}
            submitted={submitted}
        >
            <ControlledRating
                name="score"
                control={control}
                label="Your rating"
                required
            />
        </FormPreview>
    );
};

const meta: Meta<typeof ControlledRating> = {
    title: 'Controlled/Rating',
    component: ControlledRating,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ControlledRating>;

export const Default: Story = {
    render: () => <Demo />,
};

export const WithValidation: Story = {
    render: () => <Demo validate />,
};
