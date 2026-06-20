import { fireEvent, render, screen } from '@testing-library/react';
import OtpInput from '.';

describe('OtpInput', () => {
    it('renders without errors', () => {
        expect(() => render(<OtpInput />)).not.toThrow();
    });

    it('renders 6 slots by default', () => {
        const { container } = render(<OtpInput />);
        const slots = container.querySelectorAll('[data-active]');
        expect(slots).toHaveLength(6);
    });

    it('renders the correct number of slots for custom length', () => {
        const { container } = render(<OtpInput length={4} />);
        const slots = container.querySelectorAll('[data-active]');
        expect(slots).toHaveLength(4);
    });

    it('renders label when provided', () => {
        render(<OtpInput label="Verification code" />);
        expect(screen.getByText('Verification code')).toBeInTheDocument();
    });

    it('renders error message when provided', () => {
        render(<OtpInput error="Invalid code" />);
        expect(screen.getByText('Invalid code')).toBeInTheDocument();
    });

    it('renders without label when omitted', () => {
        render(<OtpInput />);
        expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('renders with separated prop without errors', () => {
        expect(() => render(<OtpInput separated />)).not.toThrow();
    });

    it('renders input element', () => {
        const { container } = render(<OtpInput />);
        expect(container.querySelector('input')).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
        const { container } = render(<OtpInput disabled />);
        expect(container.querySelector('input')).toBeDisabled();
    });

    it('calls onChange when input value changes', () => {
        const onChange = vi.fn();
        const { container } = render(<OtpInput onChange={onChange} />);
        const input = container.querySelector('input')!;
        fireEvent.input(input, { target: { value: '1' } });
        expect(onChange).toHaveBeenCalled();
    });

    it('normalizes Persian digits on input', () => {
        const onChange = vi.fn();
        const { container } = render(<OtpInput onChange={onChange} />);
        const input = container.querySelector('input')!;
        fireEvent.input(input, { target: { value: '۱۲۳' } });
        expect(onChange).toHaveBeenCalled();
    });

    it('normalizes Arabic-Indic digits on input', () => {
        const onChange = vi.fn();
        const { container } = render(<OtpInput onChange={onChange} />);
        const input = container.querySelector('input')!;
        fireEvent.input(input, { target: { value: '١٢٣' } });
        expect(onChange).toHaveBeenCalled();
    });
});
