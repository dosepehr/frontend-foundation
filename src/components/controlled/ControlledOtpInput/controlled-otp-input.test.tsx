import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { ControlledOtpInput } from '.';

type TestForm = { code: string };

function TestForm({
    defaultValues = { code: '' },
    onValueChange,
    error,
    length,
    label,
}: {
    defaultValues?: TestForm;
    onValueChange?: (val: string) => void;
    error?: string;
    length?: number;
    label?: string;
}) {
    const { control } = useForm<TestForm>({ defaultValues });
    return (
        <ControlledOtpInput
            name='code'
            control={control}
            onValueChange={onValueChange}
            error={error}
            length={length}
            label={label}
        />
    );
}

describe('ControlledOtpInput', () => {
    it('renders without errors', () => {
        expect(() => render(<TestForm />)).not.toThrow();
    });

    it('renders the underlying OtpInput input element', () => {
        const { container } = render(<TestForm />);
        expect(container.querySelector('input')).toBeInTheDocument();
    });

    it('renders 6 slots by default', () => {
        const { container } = render(<TestForm />);
        expect(container.querySelectorAll('[data-active]')).toHaveLength(6);
    });

    it('renders the correct number of slots for a custom length', () => {
        const { container } = render(<TestForm length={4} />);
        expect(container.querySelectorAll('[data-active]')).toHaveLength(4);
    });

    it('shows prop-level error', () => {
        render(<TestForm error='Invalid code' />);
        expect(screen.getByText('Invalid code')).toBeInTheDocument();
    });

    it('renders a label when provided', () => {
        render(<TestForm label='Verification code' />);
        expect(screen.getByText('Verification code')).toBeInTheDocument();
    });

    it('does not render a label when omitted', () => {
        render(<TestForm />);
        expect(screen.queryByText('Verification code')).not.toBeInTheDocument();
    });
});
