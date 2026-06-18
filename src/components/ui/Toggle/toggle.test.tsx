import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from './components';

describe('Toggle', () => {
    it('renders as a button', () => {
        render(<Toggle>Bold</Toggle>);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has data-slot="toggle"', () => {
        const { container } = render(<Toggle />);
        expect(container.querySelector('[data-slot="toggle"]')).toBeInTheDocument();
    });

    it('is off by default', () => {
        render(<Toggle>B</Toggle>);
        expect(screen.getByRole('button')).toHaveAttribute('data-state', 'off');
    });

    it('toggles to on when clicked', async () => {
        const user = userEvent.setup();
        render(<Toggle>B</Toggle>);
        await user.click(screen.getByRole('button'));
        expect(screen.getByRole('button')).toHaveAttribute('data-state', 'on');
    });

    it('toggles back to off on second click', async () => {
        const user = userEvent.setup();
        render(<Toggle>B</Toggle>);
        await user.click(screen.getByRole('button'));
        await user.click(screen.getByRole('button'));
        expect(screen.getByRole('button')).toHaveAttribute('data-state', 'off');
    });

    it('renders children', () => {
        render(<Toggle>Bold</Toggle>);
        expect(screen.getByText('Bold')).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
        render(<Toggle disabled>B</Toggle>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('calls onPressedChange with true when toggled on', async () => {
        const user = userEvent.setup();
        const onPressedChange = vi.fn();
        render(<Toggle onPressedChange={onPressedChange}>B</Toggle>);
        await user.click(screen.getByRole('button'));
        expect(onPressedChange).toHaveBeenCalledWith(true);
    });

    it('calls onPressedChange with false when toggled off', async () => {
        const user = userEvent.setup();
        const onPressedChange = vi.fn();
        render(<Toggle defaultPressed onPressedChange={onPressedChange}>B</Toggle>);
        await user.click(screen.getByRole('button'));
        expect(onPressedChange).toHaveBeenCalledWith(false);
    });

    it('reflects pressed state when pressed=true', () => {
        render(<Toggle pressed>B</Toggle>);
        expect(screen.getByRole('button')).toHaveAttribute('data-state', 'on');
    });

    it('reflects pressed=false state', () => {
        render(<Toggle pressed={false}>B</Toggle>);
        expect(screen.getByRole('button')).toHaveAttribute('data-state', 'off');
    });

    it('forwards className', () => {
        render(<Toggle className='custom-toggle'>B</Toggle>);
        expect(screen.getByRole('button')).toHaveClass('custom-toggle');
    });
});
