import FormPreview from '@/stories/helpers/FormPreview';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ControlledMultiComboBox } from '.';

const fruits = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
];

const schema = z.object({
    fruits: z.array(z.string()).min(1, 'Select at least one fruit'),
});
type FormValues = z.infer<typeof schema>;

const Demo = ({ validate = false }: { validate?: boolean }) => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { fruits: [] },
        resolver: validate ? zodResolver(schema) : undefined,
    });
    const [submitted, setSubmitted] = useState<FormValues | null>(null);

    return (
        <FormPreview
            onSubmit={handleSubmit(setSubmitted)}
            submitted={submitted}
        >
            <ControlledMultiComboBox
                name="fruits"
                control={control}
                label="Fruits"
                placeholder="Select the fruits"
                options={fruits}
                required
            />
        </FormPreview>
    );
};

const meta: Meta<typeof ControlledMultiComboBox> = {
    title: 'Controlled/MultiComboBox',
    component: ControlledMultiComboBox,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ControlledMultiComboBox>;

export const Default: Story = {
    render: () => <Demo />,
};

export const WithValidation: Story = {
    render: () => <Demo validate />,
};
