import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordInput } from './components';

describe('PasswordInput', () => {
    it('renders an input element', () => {
        const { container } = render(<PasswordInput />);
        expect(container.querySelector('input')).toBeInTheDocument();
    });

    it('input type is password by default', () => {
        const { container } = render(<PasswordInput />);
        expect(container.querySelector('input')).toHaveAttribute(
            'type',
            'password',
        );
    });

    it('shows show-password button', () => {
        render(<PasswordInput />);
        expect(screen.getByLabelText('Show password')).toBeInTheDocument();
    });

    it('toggles input type to text when show button is clicked', async () => {
        const user = userEvent.setup();
        const { container } = render(<PasswordInput />);
        await user.click(screen.getByLabelText('Show password'));
        expect(container.querySelector('input')).toHaveAttribute(
            'type',
            'text',
        );
    });

    it('shows hide-password button after toggling', async () => {
        const user = userEvent.setup();
        render(<PasswordInput />);
        await user.click(screen.getByLabelText('Show password'));
        expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
    });

    it('toggles back to password type on second click', async () => {
        const user = userEvent.setup();
        const { container } = render(<PasswordInput />);
        await user.click(screen.getByLabelText('Show password'));
        await user.click(screen.getByLabelText('Hide password'));
        expect(container.querySelector('input')).toHaveAttribute(
            'type',
            'password',
        );
    });

    it('renders label when provided', () => {
        render(<PasswordInput label="Password" />);
        expect(screen.getByText('Password')).toBeInTheDocument();
    });

    it('renders error message when provided', () => {
        render(<PasswordInput error="Invalid password" />);
        expect(screen.getByText('Invalid password')).toBeInTheDocument();
    });

    it('sets aria-invalid when error is provided', () => {
        const { container } = render(<PasswordInput error="Invalid" />);
        expect(container.querySelector('input')).toHaveAttribute(
            'aria-invalid',
            'true',
        );
    });

    it('does not set aria-invalid when no error', () => {
        const { container } = render(<PasswordInput />);
        expect(container.querySelector('input')).not.toHaveAttribute(
            'aria-invalid',
        );
    });

    it('accepts user input', async () => {
        const user = userEvent.setup();
        const { container } = render(<PasswordInput />);
        await user.type(container.querySelector('input')!, 'secret123');
        expect(container.querySelector('input')).toHaveValue('secret123');
    });

    it('uses provided id', () => {
        const { container } = render(<PasswordInput id="my-password" />);
        expect(container.querySelector('input')).toHaveAttribute(
            'id',
            'my-password',
        );
    });
});
