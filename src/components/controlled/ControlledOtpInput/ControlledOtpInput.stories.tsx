import FormPreview from '@/stories/helpers/FormPreview';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ControlledOtpInput } from '.';

const schema = z.object({
    code: z.string().length(6, 'Enter the 6-digit code'),
});
type FormValues = z.infer<typeof schema>;

const Demo = ({ validate = false }: { validate?: boolean }) => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { code: '' },
        resolver: validate ? zodResolver(schema) : undefined,
    });
    const [submitted, setSubmitted] = useState<FormValues | null>(null);

    return (
        <FormPreview
            onSubmit={handleSubmit(setSubmitted)}
            submitted={submitted}
        >
            <ControlledOtpInput
                name="code"
                control={control}
                label="Verification code"
                length={6}
                required
            />
        </FormPreview>
    );
};

const meta: Meta<typeof ControlledOtpInput> = {
    title: 'Controlled/OtpInput',
    component: ControlledOtpInput,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ControlledOtpInput>;

export const Default: Story = {
    render: () => <Demo />,
};

export const WithValidation: Story = {
    render: () => <Demo validate />,
};
