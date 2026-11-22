import { toIsoDay } from '@/utils/funcs/filterParsers';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { ControlledDatePicker } from '.';

type TestForm = { date: Date | undefined };

function TestForm({
    defaultValues = { date: undefined },
    onValueChange,
    error,
    placeholder,
}: {
    defaultValues?: TestForm;
    onValueChange?: (date: Date | undefined) => void;
    error?: string;
    placeholder?: string;
}) {
    const { control } = useForm<TestForm>({ defaultValues });
    return (
        <ControlledDatePicker
            name="date"
            control={control}
            onValueChange={onValueChange}
            error={error}
            placeholder={placeholder}
        />
    );
}

describe('ControlledDatePicker', () => {
    it('renders without errors', () => {
        expect(() => render(<TestForm />)).not.toThrow();
    });

    it('renders the underlying DatePicker trigger', () => {
        render(<TestForm />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows placeholder text when no date is selected', () => {
        render(<TestForm placeholder="Pick a date" />);
        expect(screen.getByText('Pick a date')).toBeInTheDocument();
    });

    it('shows default placeholder when no placeholder prop is given', () => {
        render(<TestForm />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows prop-level error', () => {
        render(<TestForm error="Date is required" />);
        expect(screen.getByText('Date is required')).toBeInTheDocument();
    });

    it('does not show error when error prop is omitted', () => {
        render(<TestForm />);
        expect(screen.queryByText('Date is required')).not.toBeInTheDocument();
    });

    it('reflects a pre-set date value from the form', () => {
        const date = new Date(2024, 0, 15);
        render(<TestForm defaultValues={{ date }} />);
        expect(screen.getByText(/January 15/i)).toBeInTheDocument();
    });

    it('calls onValueChange when a date is selected', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<TestForm onValueChange={onValueChange} />);
        await user.click(screen.getByRole('button'));
        const dayButtons = screen.getAllByRole('button');
        const dayButton = dayButtons.find((btn) =>
            /^\d+$/.test(btn.textContent ?? ''),
        );
        if (dayButton) await user.click(dayButton);
        expect(onValueChange).toHaveBeenCalled();
    });
});

describe('ControlledDatePicker — calendar="jalali"', () => {
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        // 1 Azar 1405
        vi.setSystemTime(new Date(2026, 10, 22));
    });
    afterEach(() => vi.useRealTimers());

    function JalaliForm({ onSubmit }: { onSubmit: (date: string) => void }) {
        const { control, handleSubmit } = useForm<TestForm>({
            defaultValues: { date: undefined },
        });
        return (
            <form
                onSubmit={handleSubmit(({ date }) =>
                    onSubmit(date ? toIsoDay(date) : ''),
                )}
            >
                <ControlledDatePicker
                    name="date"
                    control={control}
                    calendar="jalali"
                />
                <button type="submit">Submit</button>
            </form>
        );
    }

    it('shows a Jalali day and submits its Gregorian date', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        render(<JalaliForm onSubmit={onSubmit} />);

        await user.click(screen.getAllByRole('button')[0]);
        const day = within(screen.getByRole('grid'))
            .getAllByRole('button')
            .find((button) => button.textContent === '۱۵');
        if (!day) throw new Error('Day ۱۵ not found');
        await user.click(day);

        expect(screen.getAllByRole('button')[0]).toHaveTextContent(
            '۱۵ آذر ۱۴۰۵',
        );
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        expect(onSubmit).toHaveBeenCalledWith('2026-12-06');
    });
});
