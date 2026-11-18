import { isValidMobile } from '@/components/ui/MobileInput/utils/mobile/mobile';
import FormPreview from '@/stories/helpers/FormPreview';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ControlledMobileInput } from '.';

const schema = z.object({
    mobile: z.string().refine(isValidMobile, 'Enter a valid mobile number'),
});
type FormValues = z.infer<typeof schema>;

const Demo = ({ validate = false }: { validate?: boolean }) => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { mobile: '' },
        resolver: validate ? zodResolver(schema) : undefined,
    });
    const [submitted, setSubmitted] = useState<FormValues | null>(null);

    return (
        <FormPreview
            onSubmit={handleSubmit(setSubmitted)}
            submitted={submitted}
        >
            <ControlledMobileInput
                name="mobile"
                control={control}
                label="Mobile number"
                description="+98, 0098 and Persian digits are accepted."
                placeholder="Enter the mobile number"
                required
            />
        </FormPreview>
    );
};

const meta: Meta<typeof ControlledMobileInput> = {
    title: 'Controlled/MobileInput',
    component: ControlledMobileInput,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ControlledMobileInput>;

export const Default: Story = {
    render: () => <Demo />,
};

export const WithValidation: Story = {
    render: () => <Demo validate />,
};
