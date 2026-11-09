import FormPreview from '@/stories/helpers/FormPreview';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ControlledComboBox } from '.';

const fruits = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
];

const schema = z.object({ fruit: z.string().min(1, 'Select a fruit') });
type FormValues = z.infer<typeof schema>;

const Demo = ({ validate = false }: { validate?: boolean }) => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { fruit: '' },
        resolver: validate ? zodResolver(schema) : undefined,
    });
    const [submitted, setSubmitted] = useState<FormValues | null>(null);

    return (
        <FormPreview
            onSubmit={handleSubmit(setSubmitted)}
            submitted={submitted}
        >
            <ControlledComboBox
                name="fruit"
                control={control}
                label="Fruit"
                placeholder="Select the fruit"
                options={fruits}
                required
            />
        </FormPreview>
    );
};

const meta: Meta<typeof ControlledComboBox> = {
    title: 'Controlled/ComboBox',
    component: ControlledComboBox,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ControlledComboBox>;

export const Default: Story = {
    render: () => <Demo />,
};

export const WithValidation: Story = {
    render: () => <Demo validate />,
};
