import FormPreview from '@/stories/helpers/FormPreview';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ControlledRadioGroup } from '.';

const options = [
    { label: 'Standard', value: 'standard', description: '3–5 business days' },
    { label: 'Express', value: 'express', description: 'Next business day' },
];

const schema = z.object({
    shipping: z.string().min(1, 'Select a shipping method'),
});
type FormValues = z.infer<typeof schema>;

const Demo = ({ validate = false }: { validate?: boolean }) => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { shipping: '' },
        resolver: validate ? zodResolver(schema) : undefined,
    });
    const [submitted, setSubmitted] = useState<FormValues | null>(null);

    return (
        <FormPreview
            onSubmit={handleSubmit(setSubmitted)}
            submitted={submitted}
        >
            <ControlledRadioGroup
                name="shipping"
                control={control}
                label="Shipping"
                options={options}
                required
            />
        </FormPreview>
    );
};

const meta: Meta<typeof ControlledRadioGroup> = {
    title: 'Controlled/RadioGroup',
    component: ControlledRadioGroup,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ControlledRadioGroup>;

export const Default: Story = {
    render: () => <Demo />,
};

export const WithValidation: Story = {
    render: () => <Demo validate />,
};
