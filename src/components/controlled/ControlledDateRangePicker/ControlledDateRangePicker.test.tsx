import { toIsoDay } from '@/utils/funcs/filterParsers';
import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { DateRange } from 'react-day-picker';
import { useForm, useWatch } from 'react-hook-form';
import z from 'zod';
import { ControlledDateRangePicker } from '.';

const JAN_5 = new Date(2026, 0, 5);
const JAN_9 = new Date(2026, 0, 9);

const schema = z.object({
    stay: z
        .custom<DateRange>()
        .optional()
        .refine((range) => !!range?.to, 'Pick both dates'),
});
type TestForm = z.infer<typeof schema>;

function TestForm({
    defaultValues = {},
    onValueChange,
    error,
}: {
    defaultValues?: TestForm;
    onValueChange?: (range: DateRange | undefined) => void;
    error?: string;
}) {
    const { control, handleSubmit } = useForm<TestForm>({
        defaultValues,
        resolver: zodResolver(schema),
    });
    const stay = useWatch({ control, name: 'stay' });
    return (
        <form onSubmit={handleSubmit(() => {})}>
            <ControlledDateRangePicker
                name="stay"
                control={control}
                label="Stay"
                numberOfMonths={1}
                onValueChange={onValueChange}
                error={error}
            />
            <span data-testid="value">
                {stay?.from?.getDate() ?? '-'}..{stay?.to?.getDate() ?? '-'}
            </span>
            <button type="submit">Submit</button>
        </form>
    );
}

const trigger = () => screen.getAllByRole('button')[0];
const submit = () => screen.getByRole('button', { name: 'Submit' });
const getDay = (day: number) => {
    const button = within(screen.getByRole('grid'))
        .getAllByRole('button')
        .find((item) => item.textContent === String(day));
    if (!button) throw new Error(`Day ${day} not found`);
    return button;
};

describe('ControlledDateRangePicker', () => {
    it('shows the placeholder while empty', () => {
        render(<TestForm />);
        expect(trigger()).toHaveTextContent('Pick a date range');
    });

    it('shows the default range', () => {
        render(
            <TestForm defaultValues={{ stay: { from: JAN_5, to: JAN_9 } }} />,
        );
        expect(screen.getByTestId('value')).toHaveTextContent('5..9');
        expect(trigger()).not.toHaveTextContent('Pick a date range');
    });

    it('updates the form and calls onValueChange', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(
            <TestForm
                defaultValues={{ stay: { from: JAN_5, to: JAN_9 } }}
                onValueChange={onValueChange}
            />,
        );

        await user.click(trigger());
        await user.click(getDay(12));

        expect(onValueChange).toHaveBeenCalled();
        expect(screen.getByTestId('value')).not.toHaveTextContent('5..9');
    });

    it('shows the schema error on submit', async () => {
        const user = userEvent.setup();
        render(<TestForm />);

        await user.click(submit());

        expect(await screen.findByText('Pick both dates')).toBeInTheDocument();
    });

    it('prefers the error prop', () => {
        render(<TestForm error="Pick your dates" />);
        expect(screen.getByText('Pick your dates')).toBeInTheDocument();
    });
});

/** A day by its rendered label, e.g. the Persian "۱۰". */
const getDayByLabel = (label: string) => {
    const button = within(screen.getByRole('grid'))
        .getAllByRole('button')
        .find((item) => item.textContent === label);
    if (!button) throw new Error(`Day ${label} not found`);
    return button;
};

describe('ControlledDateRangePicker — calendar="jalali"', () => {
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        // 1 Farvardin 1405
        vi.setSystemTime(new Date(2026, 2, 21));
    });
    afterEach(() => vi.useRealTimers());

    function JalaliForm({
        onSubmit,
    }: {
        onSubmit: (range: { from?: string; to?: string }) => void;
    }) {
        const { control, handleSubmit } = useForm<TestForm>({
            resolver: zodResolver(schema),
        });
        return (
            <form
                onSubmit={handleSubmit(({ stay }) =>
                    onSubmit({
                        from: stay?.from && toIsoDay(stay.from),
                        to: stay?.to && toIsoDay(stay.to),
                    }),
                )}
            >
                <ControlledDateRangePicker
                    name="stay"
                    control={control}
                    calendar="jalali"
                    numberOfMonths={1}
                />
                <button type="submit">Submit</button>
            </form>
        );
    }

    it('shows a Jalali range and submits its Gregorian days', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        render(<JalaliForm onSubmit={onSubmit} />);

        await user.click(trigger());
        await user.click(getDayByLabel('۱۰'));
        await user.click(getDayByLabel('۱۲'));

        expect(trigger()).toHaveTextContent(
            '۱۰ فروردین ۱۴۰۵ – ۱۲ فروردین ۱۴۰۵',
        );
        await user.click(submit());
        expect(onSubmit).toHaveBeenCalledWith({
            from: '2026-03-30',
            to: '2026-04-01',
        });
    });
});
