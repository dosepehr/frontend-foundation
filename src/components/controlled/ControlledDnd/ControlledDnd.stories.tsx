import FormPreview from '@/stories/helpers/FormPreview';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ControlledDnd } from '.';

const schema = z.object({
    files: z.array(z.instanceof(File)).min(1, 'Add a file'),
});
type FormValues = z.infer<typeof schema>;

const Demo = ({ validate = false }: { validate?: boolean }) => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { files: [] },
        resolver: validate ? zodResolver(schema) : undefined,
    });
    const [submitted, setSubmitted] = useState<FormValues | null>(null);

    return (
        <FormPreview
            onSubmit={handleSubmit(setSubmitted)}
            submitted={submitted}
        >
            <ControlledDnd
                name="files"
                control={control}
                label="Attachments"
                multiple
            />
        </FormPreview>
    );
};

const meta: Meta<typeof ControlledDnd> = {
    title: 'Controlled/Dnd',
    component: ControlledDnd,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ControlledDnd>;

export const Default: Story = {
    render: () => <Demo />,
};

export const WithValidation: Story = {
    render: () => <Demo validate />,
};
