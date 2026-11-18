import FormPreview from '@/stories/helpers/FormPreview';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ControlledPriceInput } from '.';

const schema = z.object({
    price: z
        .number()
        .nullable()
        .refine((value) => value !== null && value > 0, 'Enter a price'),
});
type FormValues = z.infer<typeof schema>;

const Demo = ({ validate = false }: { validate?: boolean }) => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { price: null },
        resolver: validate ? zodResolver(schema) : undefined,
    });
    const [submitted, setSubmitted] = useState<FormValues | null>(null);

    return (
        <FormPreview
            onSubmit={handleSubmit(setSubmitted)}
            submitted={submitted}
        >
            <ControlledPriceInput
                name="price"
                control={control}
                label="Price"
                placeholder="Enter the price"
                currency="Toman"
                currencyPosition="end"
                decimalScale={0}
                wordsUnit="تومان"
                required
            />
        </FormPreview>
    );
};

const meta: Meta<typeof ControlledPriceInput> = {
    title: 'Controlled/PriceInput',
    component: ControlledPriceInput,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ControlledPriceInput>;

export const Default: Story = {
    render: () => <Demo />,
};

export const WithValidation: Story = {
    render: () => <Demo validate />,
};
