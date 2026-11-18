import type { TreeOption } from '@/components/ui/TreeSelect/utils/tree/tree';
import FormPreview from '@/stories/helpers/FormPreview';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ControlledTreeSelect } from '.';

const options: TreeOption[] = [
    {
        value: 'fruit',
        label: 'Fruit',
        children: [
            { value: 'apple', label: 'Apple' },
            { value: 'banana', label: 'Banana' },
        ],
    },
    { value: 'bread', label: 'Bread' },
];

const schema = z.object({
    categories: z.array(z.string()).min(1, 'Select at least one category'),
});
type FormValues = z.infer<typeof schema>;

const Demo = ({ validate = false }: { validate?: boolean }) => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { categories: [] },
        resolver: validate ? zodResolver(schema) : undefined,
    });
    const [submitted, setSubmitted] = useState<FormValues | null>(null);

    return (
        <FormPreview
            onSubmit={handleSubmit(setSubmitted)}
            submitted={submitted}
        >
            <ControlledTreeSelect
                name="categories"
                control={control}
                label="Categories"
                placeholder="Select the categories"
                options={options}
                required
            />
        </FormPreview>
    );
};

const meta: Meta<typeof ControlledTreeSelect> = {
    title: 'Controlled/TreeSelect',
    component: ControlledTreeSelect,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ControlledTreeSelect>;

export const Default: Story = {
    render: () => <Demo />,
};

export const WithValidation: Story = {
    render: () => <Demo validate />,
};
