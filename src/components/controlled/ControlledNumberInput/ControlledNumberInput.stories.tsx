import FormPreview from '@/stories/helpers/FormPreview';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ControlledNumberInput } from '.';

const schema = z.object({
    quantity: z
        .number()
        .nullable()
        .refine((value) => value !== null && value >= 1, 'At least 1'),
});
type FormValues = z.infer<typeof schema>;

const Demo = ({ validate = false }: { validate?: boolean }) => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { quantity: null },
        resolver: validate ? zodResolver(schema) : undefined,
    });
    const [submitted, setSubmitted] = useState<FormValues | null>(null);

    return (
        <FormPreview
            onSubmit={handleSubmit(setSubmitted)}
            submitted={submitted}
        >
            <ControlledNumberInput
                name="quantity"
                control={control}
                label="Quantity"
                placeholder="Enter the quantity"
                showStepper
                required
            />
        </FormPreview>
    );
};

const meta: Meta<typeof ControlledNumberInput> = {
    title: 'Controlled/NumberInput',
    component: ControlledNumberInput,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ControlledNumberInput>;

export const Default: Story = {
    render: () => <Demo />,
};

export const WithValidation: Story = {
    render: () => <Demo validate />,
};
