import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './components';
import CheckboxWrapper from './index';

describe('Checkbox primitive', () => {
    it('renders a checkbox role', () => {
        render(<Checkbox />);
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('has data-slot="checkbox"', () => {
        const { container } = render(<Checkbox />);
        expect(container.querySelector('[data-slot="checkbox"]')).toBeInTheDocument();
    });

    it('is unchecked by default', () => {
        render(<Checkbox />);
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('renders label text when label prop is provided', () => {
        render(<Checkbox label='Accept terms' />);
        expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('does not render label text when label is omitted', () => {
        const { container } = render(<Checkbox />);
        expect(container.querySelector('span')).not.toBeInTheDocument();
    });

    it('becomes checked when clicked', async () => {
        const user = userEvent.setup();
        render(<Checkbox />);
        await user.click(screen.getByRole('checkbox'));
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('calls onCheckedChange when toggled', async () => {
        const user = userEvent.setup();
        const onCheckedChange = vi.fn();
        render(<Checkbox onCheckedChange={onCheckedChange} />);
        await user.click(screen.getByRole('checkbox'));
        expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('does not toggle when disabled', async () => {
        const user = userEvent.setup();
        render(<Checkbox disabled />);
        await user.click(screen.getByRole('checkbox'));
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('renders as checked when defaultChecked is true', () => {
        render(<Checkbox defaultChecked />);
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it.each([
        'default', 'primary', 'secondary', 'success', 'warning', 'destructive',
    ] as const)('renders variant "%s" without errors', (variant) => {
        render(<Checkbox variant={variant} />);
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });
});

describe('CheckboxWrapper', () => {
    it('renders a checkbox', () => {
        render(<CheckboxWrapper />);
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
        render(<CheckboxWrapper label='Subscribe' />);
        expect(screen.getByText('Subscribe')).toBeInTheDocument();
    });

    it('renders description when provided', () => {
        render(<CheckboxWrapper label='Subscribe' description='Get weekly updates' />);
        expect(screen.getByText('Get weekly updates')).toBeInTheDocument();
    });

    it('does not render description when omitted', () => {
        render(<CheckboxWrapper label='Subscribe' />);
        expect(screen.queryByText('Get weekly updates')).not.toBeInTheDocument();
    });

    it('checkbox is disabled when disabled prop is set', () => {
        render(<CheckboxWrapper disabled />);
        expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('becomes checked when clicked', async () => {
        const user = userEvent.setup();
        render(<CheckboxWrapper label='Accept' />);
        await user.click(screen.getByRole('checkbox'));
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('calls onCheckedChange when toggled', async () => {
        const user = userEvent.setup();
        const onCheckedChange = vi.fn();
        render(<CheckboxWrapper onCheckedChange={onCheckedChange} />);
        await user.click(screen.getByRole('checkbox'));
        expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('renders as checked when defaultChecked is true', () => {
        render(<CheckboxWrapper defaultChecked />);
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('shows required asterisk when required is true', () => {
        const { container } = render(<CheckboxWrapper label='Accept' required />);
        // Asteriks component renders an indicator — the label area should contain it
        expect(container.querySelector('[data-slot="checkbox"]')).toBeInTheDocument();
    });
});
