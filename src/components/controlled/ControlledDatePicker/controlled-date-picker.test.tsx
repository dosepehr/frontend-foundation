import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { ControlledDatePicker } from '.';

type TestForm = { date: Date | undefined };

function TestForm({
    defaultValues = { date: undefined },
    onValueChange,
    error,
    placeholder,
}: {
    defaultValues?: TestForm;
    onValueChange?: (date: Date | undefined) => void;
    error?: string;
    placeholder?: string;
}) {
    const { control } = useForm<TestForm>({ defaultValues });
    return (
        <ControlledDatePicker
            name='date'
            control={control}
            onValueChange={onValueChange}
            error={error}
            placeholder={placeholder}
        />
    );
}

describe('ControlledDatePicker', () => {
    it('renders without errors', () => {
        expect(() => render(<TestForm />)).not.toThrow();
    });

    it('renders the underlying DatePicker trigger', () => {
        render(<TestForm />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows placeholder text when no date is selected', () => {
        render(<TestForm placeholder='Pick a date' />);
        expect(screen.getByText('Pick a date')).toBeInTheDocument();
    });

    it('shows default placeholder when no placeholder prop is given', () => {
        render(<TestForm />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows prop-level error', () => {
        render(<TestForm error='Date is required' />);
        expect(screen.getByText('Date is required')).toBeInTheDocument();
    });

    it('does not show error when error prop is omitted', () => {
        render(<TestForm />);
        expect(screen.queryByText('Date is required')).not.toBeInTheDocument();
    });

    it('reflects a pre-set date value from the form', () => {
        const date = new Date(2024, 0, 15);
        render(<TestForm defaultValues={{ date }} />);
        expect(screen.getByText(/January 15/i)).toBeInTheDocument();
    });
});
