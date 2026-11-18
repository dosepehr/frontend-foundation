import FormPreview from '@/stories/helpers/FormPreview';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ControlledCheckbox } from '.';

const schema = z.object({
    terms: z.boolean().refine(Boolean, 'Accept the terms to continue'),
});
type FormValues = z.infer<typeof schema>;

const Demo = ({ validate = false }: { validate?: boolean }) => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { terms: false },
        resolver: validate ? zodResolver(schema) : undefined,
    });
    const [submitted, setSubmitted] = useState<FormValues | null>(null);

    return (
        <FormPreview
            onSubmit={handleSubmit(setSubmitted)}
            submitted={submitted}
        >
            <ControlledCheckbox
                name="terms"
                control={control}
                label="I accept the terms"
                description="You can read them before signing up."
                required
            />
        </FormPreview>
    );
};

const meta: Meta<typeof ControlledCheckbox> = {
    title: 'Controlled/Checkbox',
    component: ControlledCheckbox,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ControlledCheckbox>;

export const Default: Story = {
    render: () => <Demo />,
};

export const WithValidation: Story = {
    render: () => <Demo validate />,
};
