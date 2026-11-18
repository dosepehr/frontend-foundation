import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, useWatch } from 'react-hook-form';
import z from 'zod';
import { ControlledSelect } from '.';

const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
];

const schema = z.object({ fruit: z.string().min(1, 'Select a fruit') });
type TestForm = z.infer<typeof schema>;

function TestForm({
    defaultValues = { fruit: '' },
    onValueChange,
    error,
}: {
    defaultValues?: TestForm;
    onValueChange?: (value: string) => void;
    error?: string;
}) {
    const { control, handleSubmit } = useForm<TestForm>({
        defaultValues,
        resolver: zodResolver(schema),
    });
    const fruitValue = useWatch({ control, name: 'fruit' });
    return (
        <form onSubmit={handleSubmit(() => {})}>
            <ControlledSelect
                name="fruit"
                control={control}
                label="Fruit"
                placeholder="Select the fruit"
                options={options}
                onValueChange={onValueChange}
                error={error}
            />
            <output>{fruitValue}</output>
            <button type="submit">Submit</button>
        </form>
    );
}

describe('ControlledSelect', () => {
    it('shows the placeholder while empty', () => {
        render(<TestForm />);
        expect(screen.getByRole('combobox')).toHaveTextContent(
            'Select the fruit',
        );
    });

    it('shows the default value', () => {
        render(<TestForm defaultValues={{ fruit: 'banana' }} />);
        expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
    });

    it('updates the form and calls onValueChange', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<TestForm onValueChange={onValueChange} />);

        await user.click(screen.getByRole('combobox'));
        await user.click(screen.getByRole('option', { name: 'Apple' }));

        expect(screen.getByRole('status')).toHaveTextContent('apple');
        expect(onValueChange).toHaveBeenCalledWith('apple');
    });

    it('shows the schema error on submit', async () => {
        const user = userEvent.setup();
        render(<TestForm />);

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(await screen.findByText('Select a fruit')).toBeInTheDocument();
    });

    it('prefers the error prop', () => {
        render(<TestForm error="Out of stock" />);
        expect(screen.getByText('Out of stock')).toBeInTheDocument();
    });
});
