import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { ControlledComboBox } from '.';

const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
];

type TestForm = { fruit: string };

function TestForm({
    defaultValues = { fruit: '' },
    customOnChange,
    error,
}: {
    defaultValues?: TestForm;
    customOnChange?: (val: string) => void;
    error?: string;
}) {
    const { control } = useForm<TestForm>({ defaultValues });
    return (
        <ControlledComboBox
            name="fruit"
            control={control}
            options={options}
            customOnChange={customOnChange}
            error={error}
        />
    );
}

describe('ControlledComboBox', () => {
    it('renders without errors', () => {
        expect(() => render(<TestForm />)).not.toThrow();
    });

    it('renders the underlying ComboBox', () => {
        render(<TestForm />);
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('reflects the default value from the form as display label', () => {
        render(<TestForm defaultValues={{ fruit: 'apple' }} />);
        expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
    });

    it('shows prop-level error when field has no value', () => {
        render(
            <TestForm
                defaultValues={{ fruit: '' }}
                error="Please select a fruit"
            />,
        );
        expect(screen.getByText('Please select a fruit')).toBeInTheDocument();
    });

    it('does not show error when the field has a value', () => {
        render(
            <TestForm
                defaultValues={{ fruit: 'apple' }}
                error="Please select a fruit"
            />,
        );
        expect(
            screen.queryByText('Please select a fruit'),
        ).not.toBeInTheDocument();
    });

    it('calls customOnChange when a value is selected', async () => {
        const user = userEvent.setup();
        const customOnChange = vi.fn();
        render(<TestForm customOnChange={customOnChange} />);
        const input = screen.getByRole('combobox');
        await user.type(input, 'Apple');
        await user.click(screen.getByText('Apple'));
        expect(customOnChange).toHaveBeenCalledWith('apple');
    });

    it('updates displayed label when an option is selected', async () => {
        const user = userEvent.setup();
        render(<TestForm />);
        await user.click(screen.getByRole('combobox'));
        await user.click(screen.getByText('Banana'));
        expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
    });
});
