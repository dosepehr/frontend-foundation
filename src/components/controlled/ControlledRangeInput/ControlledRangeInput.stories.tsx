import type { RangeValue } from '@/components/ui/RangeInput/RangeInput.types';
import FormPreview from '@/stories/helpers/FormPreview';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ControlledRangeInput } from '.';

const schema = z.object({
    price: z
        .tuple([z.number().nullable(), z.number().nullable()])
        .refine(([from, to]) => from !== null || to !== null, 'Set a range'),
});
type FormValues = { price: RangeValue };

const Demo = ({ validate = false }: { validate?: boolean }) => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { price: [null, null] },
        resolver: validate ? zodResolver(schema) : undefined,
    });
    const [submitted, setSubmitted] = useState<FormValues | null>(null);

    return (
        <FormPreview
            onSubmit={handleSubmit(setSubmitted)}
            submitted={submitted}
        >
            <ControlledRangeInput
                name="price"
                control={control}
                label="Price"
                min={0}
                max={1000}
                showSlider
                required
            />
        </FormPreview>
    );
};

const meta: Meta<typeof ControlledRangeInput> = {
    title: 'Controlled/RangeInput',
    component: ControlledRangeInput,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ControlledRangeInput>;

export const Default: Story = {
    render: () => <Demo />,
};

export const WithValidation: Story = {
    render: () => <Demo validate />,
};
