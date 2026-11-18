import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, useWatch } from 'react-hook-form';
import z from 'zod';
import { ControlledPriceInput } from '.';

const schema = z.object({
    price: z
        .number()
        .nullable()
        .refine((value) => value !== null && value >= 1, 'At least 1'),
});
type TestForm = z.infer<typeof schema>;

function TestForm({
    defaultValues = { price: null },
    onValueChange,
    onBlur,
    error,
}: {
    defaultValues?: TestForm;
    onValueChange?: (value: number | null) => void;
    onBlur?: () => void;
    error?: string;
}) {
    const { control, handleSubmit } = useForm<TestForm>({
        defaultValues,
        resolver: zodResolver(schema),
    });
    const priceValue = useWatch({ control, name: 'price' });
    return (
        <form onSubmit={handleSubmit(() => {})}>
            <ControlledPriceInput
                name="price"
                control={control}
                label="Price"
                onValueChange={onValueChange}
                onBlur={onBlur}
                error={error}
            />
            <output>{JSON.stringify(priceValue)}</output>
            <button type="submit">Submit</button>
        </form>
    );
}

const getInput = () => screen.getByRole('spinbutton', { name: 'Price' });

describe('ControlledPriceInput', () => {
    it('shows the default value with grouped thousands', () => {
        render(<TestForm defaultValues={{ price: 1250000 }} />);
        expect(getInput()).toHaveValue('1,250,000');
    });

    it('stores a number and calls onValueChange', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<TestForm onValueChange={onValueChange} />);

        await user.type(getInput(), '42');

        expect(screen.getByRole('status')).toHaveTextContent('42');
        expect(onValueChange).toHaveBeenLastCalledWith(42);
    });

    it('stores null once cleared', async () => {
        const user = userEvent.setup();
        render(<TestForm defaultValues={{ price: 3 }} />);

        await user.clear(getInput());

        expect(screen.getByRole('status')).toHaveTextContent('null');
    });

    it('calls onBlur', async () => {
        const user = userEvent.setup();
        const onBlur = vi.fn();
        render(<TestForm onBlur={onBlur} />);

        await user.click(getInput());
        await user.tab();

        expect(onBlur).toHaveBeenCalled();
    });

    it('shows the schema error on submit', async () => {
        const user = userEvent.setup();
        render(<TestForm defaultValues={{ price: 0 }} />);

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(await screen.findByText('At least 1')).toBeInTheDocument();
    });

    it('prefers the error prop', () => {
        render(<TestForm error="Over budget" />);
        expect(screen.getByText('Over budget')).toBeInTheDocument();
    });
});
