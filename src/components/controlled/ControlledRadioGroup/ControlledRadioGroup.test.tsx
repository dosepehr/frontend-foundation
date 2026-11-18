import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, useWatch } from 'react-hook-form';
import z from 'zod';
import { ControlledRadioGroup } from '.';

const options = [
    { label: 'Standard', value: 'standard' },
    { label: 'Express', value: 'express' },
];

const schema = z.object({ shipping: z.string().min(1, 'Select a method') });
type TestForm = z.infer<typeof schema>;

function TestForm({
    defaultValues = { shipping: '' },
    onValueChange,
    error,
    description,
    required,
}: {
    defaultValues?: TestForm;
    onValueChange?: (value: string) => void;
    error?: string;
    description?: string;
    required?: boolean;
}) {
    const { control, handleSubmit } = useForm<TestForm>({
        defaultValues,
        resolver: zodResolver(schema),
    });
    const shippingValue = useWatch({ control, name: 'shipping' });
    return (
        <form onSubmit={handleSubmit(() => {})}>
            <ControlledRadioGroup
                name="shipping"
                control={control}
                label="Shipping"
                description={description}
                required={required}
                options={options}
                onValueChange={onValueChange}
                error={error}
            />
            <output>{shippingValue}</output>
            <button type="submit">Submit</button>
        </form>
    );
}

describe('ControlledRadioGroup', () => {
    it('groups the options under a legend', () => {
        render(<TestForm />);
        expect(screen.getByRole('group', { name: 'Shipping' })).toBeVisible();
        expect(screen.getAllByRole('radio')).toHaveLength(2);
    });

    it('marks only the legend as required', () => {
        const { container } = render(<TestForm required />);
        expect(container.querySelector('legend')?.childElementCount).toBe(1);
        expect(screen.getByText('Standard').childElementCount).toBe(0);
    });

    it('shows a description', () => {
        render(<TestForm description="Arrives in 3 days" />);
        expect(screen.getByText('Arrives in 3 days')).toBeInTheDocument();
    });

    it('reflects the default value', () => {
        render(<TestForm defaultValues={{ shipping: 'express' }} />);
        expect(screen.getByRole('radio', { name: 'Express' })).toBeChecked();
    });

    it('updates the form and calls onValueChange', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<TestForm onValueChange={onValueChange} />);

        await user.click(screen.getByRole('radio', { name: 'Express' }));

        expect(screen.getByRole('status')).toHaveTextContent('express');
        expect(onValueChange).toHaveBeenCalledWith('express');
    });

    it('shows the schema error on submit', async () => {
        const user = userEvent.setup();
        render(<TestForm />);

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'Select a method',
        );
        expect(screen.getByRole('radiogroup')).toHaveAttribute(
            'aria-invalid',
            'true',
        );
    });

    it('prefers the error prop', () => {
        render(<TestForm error="Unavailable" />);
        expect(screen.getByRole('alert')).toHaveTextContent('Unavailable');
    });
});
