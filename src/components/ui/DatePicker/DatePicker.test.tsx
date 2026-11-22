import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DatePicker from '.';

describe('DatePicker', () => {
    it('renders a trigger button', () => {
        render(<DatePicker />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows placeholder when no value is set', () => {
        render(<DatePicker placeholder="Pick a date" />);
        expect(screen.getByText('Pick a date')).toBeInTheDocument();
    });

    it('shows formatted date when value is provided', () => {
        const date = new Date(2024, 0, 15); // Jan 15 2024
        render(<DatePicker value={date} />);
        // default format 'PPP' → "January 15th, 2024"
        expect(screen.getByText(/january 15/i)).toBeInTheDocument();
    });

    it('renders label when provided', () => {
        render(<DatePicker label="Birth date" />);
        expect(screen.getByText('Birth date')).toBeInTheDocument();
    });

    it('does not render label when omitted', () => {
        render(<DatePicker />);
        expect(screen.queryByText('Birth date')).not.toBeInTheDocument();
    });

    it('renders description when provided', () => {
        render(<DatePicker description="Select your date of birth" />);
        expect(
            screen.getByText('Select your date of birth'),
        ).toBeInTheDocument();
    });

    it('does not render description when omitted', () => {
        render(<DatePicker />);
        expect(
            screen.queryByText('Select your date of birth'),
        ).not.toBeInTheDocument();
    });

    it('renders error message when error is provided', () => {
        render(<DatePicker error="Date is required" />);
        expect(screen.getByText('Date is required')).toBeInTheDocument();
    });

    it('sets aria-invalid on trigger when error is provided', () => {
        render(<DatePicker error="Invalid" />);
        expect(screen.getByRole('button')).toHaveAttribute(
            'aria-invalid',
            'true',
        );
    });

    it('does not set aria-invalid when no error', () => {
        render(<DatePicker />);
        expect(screen.getByRole('button')).not.toHaveAttribute('aria-invalid');
    });

    it('is disabled when disabled prop is true', () => {
        render(<DatePicker disabled />);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('opens calendar popover on trigger click', async () => {
        const user = userEvent.setup();
        render(<DatePicker />);
        await user.click(screen.getByRole('button'));
        expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('calls onChange when a day is selected', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<DatePicker onChange={onChange} />);
        await user.click(screen.getByRole('button'));
        const dayButtons = screen.getAllByRole('button');
        const dayButton = dayButtons.find((btn) =>
            /^\d+$/.test(btn.textContent ?? ''),
        );
        if (dayButton) await user.click(dayButton);
        expect(onChange).toHaveBeenCalled();
    });

    it('respects controlled open=true', () => {
        render(<DatePicker open={true} />);
        expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('respects controlled open=false', () => {
        render(<DatePicker open={false} />);
        expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });

    it('calls onOpenChange when trigger is clicked', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        render(<DatePicker onOpenChange={onOpenChange} />);
        await user.click(screen.getByRole('button'));
        expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('renders custom startAddon', () => {
        render(<DatePicker startAddon={<span data-testid="addon">@</span>} />);
        expect(screen.getByTestId('addon')).toBeInTheDocument();
    });
});

describe('DatePicker — calendar="jalali"', () => {
    // 1 Azar 1405 (Sunday) is 22 November 2026.
    const AZAR_1 = new Date(2026, 10, 22);

    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(AZAR_1);
    });
    afterEach(() => vi.useRealTimers());

    it('shows the value as a Jalali date', () => {
        render(<DatePicker calendar="jalali" value={AZAR_1} />);
        expect(screen.getByRole('button')).toHaveTextContent('۱ آذر ۱۴۰۵');
    });

    it('keeps an explicit format', () => {
        render(
            <DatePicker calendar="jalali" value={AZAR_1} format="yyyy/MM/dd" />,
        );
        expect(screen.getByRole('button')).toHaveTextContent('۱۴۰۵/۰۹/۰۱');
    });

    it('opens a Jalali grid and returns a Gregorian date', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<DatePicker calendar="jalali" onChange={onChange} />);
        await user.click(screen.getByRole('button'));

        const grid = screen.getByRole('grid');
        expect(grid).toHaveAccessibleName(/آذر ۱۴۰۵/);
        const day = within(grid)
            .getAllByRole('button')
            .find((button) => button.textContent === '۱۵');
        if (!day) throw new Error('Day ۱۵ not found');
        await user.click(day);

        // 15 Azar 1405 is 6 December 2026.
        expect(onChange.mock.calls[0][0]).toEqual(new Date(2026, 11, 6));
    });

    it('disables days with Gregorian matchers', async () => {
        const user = userEvent.setup();
        render(
            <DatePicker
                calendar="jalali"
                disabledDates={{ after: new Date(2026, 11, 1) }}
            />,
        );
        await user.click(screen.getByRole('button'));
        const days = within(screen.getByRole('grid')).getAllByRole('button');
        // 10 Azar is 1 December; 11 Azar is the first disabled day.
        expect(days.find((b) => b.textContent === '۱۰')).toBeEnabled();
        expect(days.find((b) => b.textContent === '۱۱')).toBeDisabled();
    });
});
