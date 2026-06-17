import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar } from './calendar';

describe('Calendar', () => {
    it('renders with data-slot="calendar"', () => {
        const { container } = render(<Calendar />);
        expect(container.querySelector('[data-slot="calendar"]')).toBeInTheDocument();
    });

    it('renders day cells for the current month', () => {
        render(<Calendar />);
        // DayPicker renders day buttons — at least one should exist
        const dayButtons = screen.getAllByRole('button');
        expect(dayButtons.length).toBeGreaterThan(0);
    });

    it('renders prev/next navigation buttons', () => {
        render(<Calendar />);
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('navigates to the next month on next button click', async () => {
        const user = userEvent.setup();
        render(<Calendar />);

        const now = new Date();
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const nextMonthLabel = nextMonth.toLocaleString('default', { month: 'long' });

        const nextBtn = screen.getByRole('button', { name: /next/i });
        await user.click(nextBtn);

        expect(screen.getByText(new RegExp(nextMonthLabel, 'i'))).toBeInTheDocument();
    });

    it('calls onDayClick when a day is selected', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        render(<Calendar mode='single' onSelect={onSelect} />);

        const dayButtons = screen.getAllByRole('button');
        // click the first non-navigation day button (skip prev/next)
        const dayButton = dayButtons.find((btn) => /^\d+$/.test(btn.textContent ?? ''));
        if (dayButton) await user.click(dayButton);

        expect(onSelect).toHaveBeenCalled();
    });

    it('does not select a disabled day', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        // disable all days
        render(<Calendar mode='single' onSelect={onSelect} disabled={() => true} />);

        const dayButtons = screen.getAllByRole('button');
        const dayButton = dayButtons.find((btn) => /^\d+$/.test(btn.textContent ?? ''));
        if (dayButton) await user.click(dayButton);

        expect(onSelect).not.toHaveBeenCalled();
    });

    it('forwards className', () => {
        const { container } = render(<Calendar className='custom-cal' />);
        expect(container.querySelector('[data-slot="calendar"]')).toHaveClass('custom-cal');
    });
});
