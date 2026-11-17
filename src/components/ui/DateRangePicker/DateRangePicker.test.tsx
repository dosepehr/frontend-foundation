import { faIR, getDateLib } from '@daypicker/persian';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import DateRangePicker from '.';
import type { DateRangePickerProps } from './DateRangePicker.types';

const JAN_5 = new Date(2026, 0, 5);
const JAN_9 = new Date(2026, 0, 9);

function Controlled(props: DateRangePickerProps) {
    const [value, setValue] = useState<DateRange | undefined>(props.value);
    return (
        <>
            <DateRangePicker {...props} value={value} onChange={setValue} />
            <span data-testid="range">
                {value?.from?.getDate() ?? '-'}..{value?.to?.getDate() ?? '-'}
            </span>
        </>
    );
}

const getDay = (day: number) => {
    const button = within(screen.getByRole('grid'))
        .getAllByRole('button')
        .find((item) => item.textContent === String(day));
    if (!button) throw new Error(`Day ${day} not found`);
    return button;
};

const trigger = () => screen.getAllByRole('button')[0];

describe('DateRangePicker — trigger', () => {
    it('shows the placeholder while empty', () => {
        render(<DateRangePicker />);
        expect(trigger()).toHaveTextContent('Pick a date range');
    });

    it('shows both ends of the range', () => {
        render(<DateRangePicker value={{ from: JAN_5, to: JAN_9 }} />);
        expect(trigger()).toHaveTextContent('Jan 5, 2026 – Jan 9, 2026');
    });

    it('shows an open end while only the start is picked', () => {
        render(<DateRangePicker value={{ from: JAN_5, to: undefined }} />);
        expect(trigger()).toHaveTextContent('Jan 5, 2026 – …');
    });

    it('uses a custom format', () => {
        render(
            <DateRangePicker
                value={{ from: JAN_5, to: JAN_9 }}
                format="yyyy-MM-dd"
            />,
        );
        expect(trigger()).toHaveTextContent('2026-01-05 – 2026-01-09');
    });

    it('renders the label, description and error', () => {
        render(
            <DateRangePicker
                label="Stay"
                description="Check-in to check-out"
                error="Pick your dates"
            />,
        );
        expect(screen.getByLabelText('Stay')).toBe(trigger());
        expect(screen.getByText('Check-in to check-out')).toBeInTheDocument();
        expect(screen.getByText('Pick your dates')).toBeInTheDocument();
        expect(trigger()).toHaveAttribute('aria-invalid', 'true');
    });

    it('can be disabled', () => {
        render(<DateRangePicker disabled />);
        expect(trigger()).toBeDisabled();
    });
});

describe('DateRangePicker — picking', () => {
    it('shows two months by default', async () => {
        const user = userEvent.setup();
        render(<DateRangePicker value={{ from: JAN_5, to: JAN_9 }} />);

        await user.click(trigger());

        expect(screen.getAllByRole('grid')).toHaveLength(2);
    });

    it('picks a range and closes after the second pick', async () => {
        const user = userEvent.setup();
        render(<Controlled numberOfMonths={1} />);
        await user.click(trigger());

        await user.click(getDay(12));
        expect(screen.getByRole('grid')).toBeInTheDocument();
        expect(screen.getByTestId('range')).toHaveTextContent('12..12');

        await user.click(getDay(15));
        expect(screen.getByTestId('range')).toHaveTextContent('12..15');
        expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });

    it('stays open with closeOnSelect={false}', async () => {
        const user = userEvent.setup();
        render(<Controlled numberOfMonths={1} closeOnSelect={false} />);
        await user.click(trigger());

        await user.click(getDay(12));
        await user.click(getDay(14));

        expect(screen.getByRole('grid')).toBeInTheDocument();
        expect(screen.getByTestId('range')).toHaveTextContent('12..14');
    });

    it('reports each pick', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<DateRangePicker numberOfMonths={1} onChange={onChange} />);
        await user.click(trigger());

        await user.click(getDay(12));

        expect(onChange).toHaveBeenCalledTimes(1);
        const range = onChange.mock.calls[0][0] as DateRange;
        expect(range.from?.getDate()).toBe(12);
    });

    it('does not pick disabled dates', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <DateRangePicker
                numberOfMonths={1}
                value={{ from: JAN_5, to: JAN_9 }}
                disabledDates={{ after: JAN_9 }}
                onChange={onChange}
            />,
        );
        await user.click(trigger());

        expect(getDay(20)).toBeDisabled();
    });

    it('respects a controlled open state', () => {
        const { rerender } = render(<DateRangePicker open />);
        expect(screen.getAllByRole('grid').length).toBeGreaterThan(0);

        rerender(<DateRangePicker open={false} />);
        expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });
});

describe('DateRangePicker — Jalali calendar', () => {
    const jalali = {
        dateLib: getDateLib({ locale: faIR, numerals: 'arabext' }),
        locale: faIR,
        dir: 'rtl' as const,
        numerals: 'arabext' as const,
    };
    // 1 Farvardin 1405 – 5 Farvardin 1405
    const NOWRUZ = { from: new Date(2026, 2, 21), to: new Date(2026, 2, 25) };

    it('labels the range with Jalali dates', () => {
        render(
            <DateRangePicker
                value={NOWRUZ}
                calendarProps={jalali}
                format="d LLLL y"
            />,
        );
        expect(trigger()).toHaveTextContent('۱ فروردین ۱۴۰۵ – ۵ فروردین ۱۴۰۵');
    });

    it('shows the Jalali month and picks days in it', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <DateRangePicker
                value={NOWRUZ}
                numberOfMonths={1}
                calendarProps={jalali}
                onChange={onChange}
            />,
        );
        await user.click(trigger());

        const grid = screen.getByRole('grid');
        expect(grid).toHaveAccessibleName(/فروردین ۱۴۰۵/);

        const day10 = within(grid)
            .getAllByRole('button')
            .find((button) => button.textContent === '۱۰');
        if (!day10) throw new Error('Day ۱۰ not found');
        await user.click(day10);

        const range = onChange.mock.calls[0][0] as DateRange;
        // 10 Farvardin 1405 is 30 March 2026.
        expect(
            [range.from?.getMonth(), range.from?.getDate()].concat(
                range.to ? [range.to.getMonth(), range.to.getDate()] : [],
            ),
        ).toEqual([2, 21, 2, 30]);
    });
});
