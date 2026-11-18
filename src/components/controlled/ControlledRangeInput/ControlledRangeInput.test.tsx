import type { RangeValue } from '@/components/ui/RangeInput/RangeInput.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, useWatch } from 'react-hook-form';
import z from 'zod';
import { ControlledRangeInput } from '.';

const schema = z.object({
    price: z
        .tuple([z.number().nullable(), z.number().nullable()])
        .refine(([from, to]) => from !== null || to !== null, 'Set a range'),
});
type TestForm = { price: RangeValue };

function TestForm({
    defaultValues = { price: [null, null] },
    onValueChange,
    error,
}: {
    defaultValues?: TestForm;
    onValueChange?: (value: RangeValue) => void;
    error?: string;
}) {
    const { control, handleSubmit } = useForm<TestForm>({
        defaultValues,
        resolver: zodResolver(schema),
    });
    const priceValue = useWatch({ control, name: 'price' });
    return (
        <form onSubmit={handleSubmit(() => {})}>
            <ControlledRangeInput
                name="price"
                control={control}
                label="Price"
                onValueChange={onValueChange}
                error={error}
            />
            <output>{JSON.stringify(priceValue)}</output>
            <button type="submit">Submit</button>
        </form>
    );
}

const getFrom = () => screen.getByRole('spinbutton', { name: 'Minimum' });
const getTo = () => screen.getByRole('spinbutton', { name: 'Maximum' });

describe('ControlledRangeInput', () => {
    it('shows the default range', () => {
        render(<TestForm defaultValues={{ price: [10, 90] }} />);
        expect(getFrom()).toHaveValue('10');
        expect(getTo()).toHaveValue('90');
    });

    it('treats a missing value as an open range', () => {
        render(<TestForm defaultValues={{} as TestForm} />);
        expect(getFrom()).toHaveValue('');
        expect(getTo()).toHaveValue('');
    });

    it('updates the form and calls onValueChange', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<TestForm onValueChange={onValueChange} />);

        await user.type(getFrom(), '5');
        await user.type(getTo(), '50');

        expect(screen.getByRole('status')).toHaveTextContent('[5,50]');
        expect(onValueChange).toHaveBeenLastCalledWith([5, 50]);
    });

    it('shows the schema error on submit', async () => {
        const user = userEvent.setup();
        render(<TestForm />);

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(await screen.findByText('Set a range')).toBeInTheDocument();
    });

    it('prefers the error prop', () => {
        render(<TestForm error="Out of range" />);
        expect(screen.getByText('Out of range')).toBeInTheDocument();
    });
});
