import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calendar from '.';

describe('Calendar', () => {
    it('renders with data-slot="calendar"', () => {
        const { container } = render(<Calendar />);
        expect(
            container.querySelector('[data-slot="calendar"]'),
        ).toBeInTheDocument();
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
        const nextMonthLabel = nextMonth.toLocaleString('default', {
            month: 'long',
        });

        const nextBtn = screen.getByRole('button', { name: /next/i });
        await user.click(nextBtn);

        expect(
            screen.getByText(new RegExp(nextMonthLabel, 'i')),
        ).toBeInTheDocument();
    });

    it('calls onDayClick when a day is selected', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        render(<Calendar mode="single" onSelect={onSelect} />);

        const dayButtons = screen.getAllByRole('button');
        // click the first non-navigation day button (skip prev/next)
        const dayButton = dayButtons.find((btn) =>
            /^\d+$/.test(btn.textContent ?? ''),
        );
        if (dayButton) await user.click(dayButton);

        expect(onSelect).toHaveBeenCalled();
    });

    it('does not select a disabled day', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        // disable all days
        render(
            <Calendar
                mode="single"
                onSelect={onSelect}
                disabled={() => true}
            />,
        );

        const dayButtons = screen.getAllByRole('button');
        const dayButton = dayButtons.find((btn) =>
            /^\d+$/.test(btn.textContent ?? ''),
        );
        if (dayButton) await user.click(dayButton);

        expect(onSelect).not.toHaveBeenCalled();
    });

    it('forwards className', () => {
        const { container } = render(<Calendar className="custom-cal" />);
        expect(container.querySelector('[data-slot="calendar"]')).toHaveClass(
            'custom-cal',
        );
    });

    it('renders week numbers when showWeekNumber is true', () => {
        const { container } = render(<Calendar showWeekNumber />);
        expect(
            container.querySelector('[data-slot="calendar"]'),
        ).toBeInTheDocument();
    });

    it('renders with dropdown caption layout without errors', () => {
        expect(() =>
            render(
                <Calendar
                    captionLayout="dropdown"
                    startMonth={new Date(2020, 0, 1)}
                    endMonth={new Date(2030, 11, 31)}
                />,
            ),
        ).not.toThrow();
    });
});

// 1 Azar 1405 (Sunday). Azar 1405 runs Nov 22 – Dec 21, 2026.
const AZAR_1 = new Date(2026, 10, 22);

/** A day of the shown month by its Persian label, e.g. "۵". */
const getJalaliDay = (label: string) => {
    const button = within(screen.getByRole('grid'))
        .getAllByRole('button')
        .find(
            (item) =>
                item.textContent === label &&
                !item.closest('[data-outside="true"]'),
        );
    if (!button) throw new Error(`Day ${label} not found`);
    return button;
};

// The weekday row is aria-hidden, so it has no columnheader role.
const weekdayHeaders = (container: HTMLElement) =>
    [...container.querySelectorAll('.rdp-weekday')].map(
        (cell) => cell.textContent,
    );

describe('Calendar (jalali)', () => {
    it('shows the Jalali month with Persian digits', () => {
        render(
            <Calendar calendar="jalali" mode="single" defaultMonth={AZAR_1} />,
        );
        expect(screen.getByText('آذر ۱۴۰۵')).toBeInTheDocument();
        expect(getJalaliDay('۳۰')).toBeInTheDocument();
        expect(screen.queryByText('۳۱')).not.toBeInTheDocument();
    });

    it('renders right to left and starts the week on Saturday', () => {
        const { container } = render(
            <Calendar calendar="jalali" defaultMonth={AZAR_1} />,
        );
        expect(
            container.querySelector('[data-slot="calendar"]'),
        ).toHaveAttribute('dir', 'rtl');
        expect(weekdayHeaders(container)).toEqual([
            'ش',
            'ی',
            'د',
            'س',
            'چ',
            'پ',
            'ج',
        ]);
    });

    it('selects a single day as a Gregorian Date', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        render(
            <Calendar
                calendar="jalali"
                mode="single"
                defaultMonth={AZAR_1}
                onSelect={onSelect}
            />,
        );
        await user.click(getJalaliDay('۵'));
        expect(onSelect.mock.calls[0][0]).toEqual(new Date(2026, 10, 26));
    });

    it('selects a range as Gregorian Dates', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        const { rerender } = render(
            <Calendar
                calendar="jalali"
                mode="range"
                defaultMonth={AZAR_1}
                onSelect={onSelect}
            />,
        );
        await user.click(getJalaliDay('۱۰'));
        const first = onSelect.mock.calls[0][0];
        rerender(
            <Calendar
                calendar="jalali"
                mode="range"
                defaultMonth={AZAR_1}
                selected={first}
                onSelect={onSelect}
            />,
        );
        await user.click(getJalaliDay('۱۴'));
        expect(onSelect.mock.calls[1][0]).toEqual({
            from: new Date(2026, 11, 1),
            to: new Date(2026, 11, 5),
        });
    });

    it('marks the selected Jalali day', () => {
        render(
            <Calendar
                calendar="jalali"
                mode="single"
                selected={new Date(2026, 11, 21)}
            />,
        );
        expect(getJalaliDay('۳۰')).toHaveAttribute(
            'data-selected-single',
            'true',
        );
    });

    it('respects disabled Gregorian matchers', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        render(
            <Calendar
                calendar="jalali"
                mode="single"
                defaultMonth={AZAR_1}
                disabled={{ before: new Date(2026, 10, 25) }}
                onSelect={onSelect}
            />,
        );
        expect(getJalaliDay('۳')).toBeDisabled();
        await user.click(getJalaliDay('۳'));
        expect(onSelect).not.toHaveBeenCalled();
        expect(getJalaliDay('۴')).toBeEnabled();
    });

    it('applies the range max like the Gregorian calendar', async () => {
        const user = userEvent.setup();
        const pick = async (
            calendar: 'gregorian' | 'jalali',
            label: string,
        ) => {
            const onSelect = vi.fn();
            const { unmount } = render(
                <Calendar
                    calendar={calendar}
                    mode="range"
                    defaultMonth={AZAR_1}
                    selected={{ from: AZAR_1, to: AZAR_1 }}
                    max={3}
                    onSelect={onSelect}
                />,
            );
            await user.click(getJalaliDay(label));
            unmount();
            return onSelect.mock.calls[0][0];
        };
        // Nov 26 is four nights after Nov 22, past the max of three.
        const gregorian = await pick('gregorian', '26');
        const jalali = await pick('jalali', '۵');
        expect(jalali).toEqual(gregorian);
        expect(await pick('jalali', '۴')).toEqual({
            from: AZAR_1,
            to: new Date(2026, 10, 25),
        });
    });

    it('moves between Jalali months', async () => {
        const user = userEvent.setup();
        render(<Calendar calendar="jalali" defaultMonth={AZAR_1} />);
        await user.click(
            screen.getByRole('button', { name: 'رفتن به ماه بعد' }),
        );
        expect(screen.getByText('دی ۱۴۰۵')).toBeInTheDocument();
        await user.click(
            screen.getByRole('button', { name: 'رفتن به ماه قبل' }),
        );
        await user.click(
            screen.getByRole('button', { name: 'رفتن به ماه قبل' }),
        );
        expect(screen.getByText('آبان ۱۴۰۵')).toBeInTheDocument();
    });

    it('lists Jalali months and years in the dropdown caption', () => {
        render(
            <Calendar
                calendar="jalali"
                captionLayout="dropdown"
                defaultMonth={AZAR_1}
                startMonth={new Date(2025, 2, 21)}
                endMonth={new Date(2027, 2, 20)}
            />,
        );
        const [month, year] = screen.getAllByRole('combobox');
        expect(
            within(month)
                .getAllByRole('option')
                .map((o) => o.textContent),
        ).toContain('فروردین');
        expect(
            within(year)
                .getAllByRole('option')
                .map((o) => o.textContent),
        ).toEqual(['۱۴۰۴', '۱۴۰۵']);
    });

    it('shows Jalali week numbers', () => {
        render(
            <Calendar calendar="jalali" defaultMonth={AZAR_1} showWeekNumber />,
        );
        expect(screen.getAllByRole('rowheader').length).toBeGreaterThan(0);
    });

    it('lets explicit props override the Jalali defaults', () => {
        const { container } = render(
            <Calendar
                calendar="jalali"
                mode="single"
                defaultMonth={AZAR_1}
                dir="ltr"
                numerals="latn"
                weekStartsOn={0}
            />,
        );
        expect(
            container.querySelector('[data-slot="calendar"]'),
        ).toHaveAttribute('dir', 'ltr');
        expect(getJalaliDay('30')).toBeInTheDocument();
        expect(weekdayHeaders(container)[0]).toBe('ی');
    });

    it('keeps the Gregorian calendar by default', () => {
        render(<Calendar defaultMonth={AZAR_1} />);
        expect(screen.getByText('November 2026')).toBeInTheDocument();
    });
});
