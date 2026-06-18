import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './components';
import SwitchWrapper from '.';

describe('Switch', () => {
    it('renders a switch element', () => {
        const { container } = render(<Switch />);
        expect(container.querySelector('[data-slot="switch"]')).toBeInTheDocument();
    });

    it('is unchecked by default', () => {
        const { container } = render(<Switch />);
        expect(container.querySelector('[data-slot="switch"]')).toHaveAttribute('data-state', 'unchecked');
    });

    it('becomes checked when clicked', async () => {
        const user = userEvent.setup();
        const { container } = render(<Switch />);
        await user.click(container.querySelector('[data-slot="switch"]')!);
        expect(container.querySelector('[data-slot="switch"]')).toHaveAttribute('data-state', 'checked');
    });

    it('is disabled when disabled prop is true', () => {
        const { container } = render(<Switch disabled />);
        expect(container.querySelector('[data-slot="switch"]')).toBeDisabled();
    });

    it('calls onCheckedChange when toggled', async () => {
        const user = userEvent.setup();
        const onCheckedChange = vi.fn();
        const { container } = render(<Switch onCheckedChange={onCheckedChange} />);
        await user.click(container.querySelector('[data-slot="switch"]')!);
        expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('reflects checked state when checked prop is true', () => {
        const { container } = render(<Switch checked onCheckedChange={() => {}} />);
        expect(container.querySelector('[data-slot="switch"]')).toHaveAttribute('data-state', 'checked');
    });

    it('renders label text when label prop is provided', () => {
        render(<Switch label='Enable notifications' />);
        expect(screen.getByText('Enable notifications')).toBeInTheDocument();
    });

    it('renders thumb element', () => {
        const { container } = render(<Switch />);
        expect(container.querySelector('[data-slot="switch-thumb"]')).toBeInTheDocument();
    });
});

describe('SwitchWrapper', () => {
    it('renders a switch', () => {
        const { container } = render(<SwitchWrapper />);
        expect(container.querySelector('[data-slot="switch"]')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
        render(<SwitchWrapper label='Dark mode' />);
        expect(screen.getByText('Dark mode')).toBeInTheDocument();
    });

    it('renders description when provided', () => {
        render(<SwitchWrapper label='Dark mode' description='Applies dark theme' />);
        expect(screen.getByText('Applies dark theme')).toBeInTheDocument();
    });

    it('does not render description when omitted', () => {
        render(<SwitchWrapper label='Dark mode' />);
        expect(screen.queryByText('Applies dark theme')).not.toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
        const { container } = render(<SwitchWrapper disabled />);
        expect(container.querySelector('[data-slot="switch"]')).toBeDisabled();
    });

    it('calls onCheckedChange when toggled', async () => {
        const user = userEvent.setup();
        const onCheckedChange = vi.fn();
        const { container } = render(<SwitchWrapper onCheckedChange={onCheckedChange} />);
        await user.click(container.querySelector('[data-slot="switch"]')!);
        expect(onCheckedChange).toHaveBeenCalledWith(true);
    });
});
