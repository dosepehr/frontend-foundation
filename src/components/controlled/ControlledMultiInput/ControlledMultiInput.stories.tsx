import FormPreview from '@/stories/helpers/FormPreview';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ControlledMultiInput } from '.';

const schema = z.object({
    tags: z.array(z.string()).min(1, 'Add at least one tag'),
});
type FormValues = z.infer<typeof schema>;

const Demo = ({ validate = false }: { validate?: boolean }) => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { tags: [] },
        resolver: validate ? zodResolver(schema) : undefined,
    });
    const [submitted, setSubmitted] = useState<FormValues | null>(null);

    return (
        <FormPreview
            onSubmit={handleSubmit(setSubmitted)}
            submitted={submitted}
        >
            <ControlledMultiInput
                name="tags"
                control={control}
                label="Tags"
                placeholder="Enter the tags"
                required
            />
        </FormPreview>
    );
};

const meta: Meta<typeof ControlledMultiInput> = {
    title: 'Controlled/MultiInput',
    component: ControlledMultiInput,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ControlledMultiInput>;

export const Default: Story = {
    render: () => <Demo />,
};

export const WithValidation: Story = {
    render: () => <Demo validate />,
};
