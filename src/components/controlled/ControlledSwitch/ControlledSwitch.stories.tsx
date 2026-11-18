import FormPreview from '@/stories/helpers/FormPreview';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ControlledSwitch } from '.';

const schema = z.object({
    notifications: z
        .boolean()
        .refine(Boolean, 'Turn on notifications to continue'),
});
type FormValues = z.infer<typeof schema>;

const Demo = ({ validate = false }: { validate?: boolean }) => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { notifications: false },
        resolver: validate ? zodResolver(schema) : undefined,
    });
    const [submitted, setSubmitted] = useState<FormValues | null>(null);

    return (
        <FormPreview
            onSubmit={handleSubmit(setSubmitted)}
            submitted={submitted}
        >
            <ControlledSwitch
                name="notifications"
                control={control}
                label="Email notifications"
                description="Order updates and receipts."
            />
        </FormPreview>
    );
};

const meta: Meta<typeof ControlledSwitch> = {
    title: 'Controlled/Switch',
    component: ControlledSwitch,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ControlledSwitch>;

export const Default: Story = {
    render: () => <Demo />,
};

export const WithValidation: Story = {
    render: () => <Demo validate />,
};
