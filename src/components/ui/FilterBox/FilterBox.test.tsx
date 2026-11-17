import type { Filters, NumberRange } from '@/utils/funcs/filters';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import FilterBox from '.';
import type { FilterBoxProps } from './FilterBox.types';

const STATUS = [
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'closed', label: 'Closed' },
];

type Initial = { status?: string; tags?: string[] };

function Harness({
    initial = {},
    ...props
}: Partial<FilterBoxProps> & { initial?: Initial }) {
    const [status, setStatus] = useState<string | null>(initial.status ?? null);
    const [tags, setTags] = useState<string[] | null>(initial.tags ?? null);
    const [owner, setOwner] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [created, setCreated] = useState<DateRange | null>(null);
    const [price, setPrice] = useState<NumberRange | null>(null);

    const filters: Filters = {
        status: {
            type: 'select',
            label: 'Status',
            options: STATUS,
            value: status,
            onChange: setStatus,
        },
        tags: {
            type: 'multiselect',
            label: 'Tags',
            options: STATUS,
            value: tags,
            onChange: setTags,
        },
        owner: {
            type: 'select',
            label: 'Owner',
            options: STATUS,
            searchable: true,
            value: owner,
            onChange: setOwner,
        },
        name: { type: 'text', label: 'Name', value: name, onChange: setName },
        created: {
            type: 'date',
            label: 'Created',
            value: created,
            onChange: setCreated,
        },
        price: {
            type: 'number-range',
            label: 'Price',
            max: 1000,
            value: price,
            onChange: setPrice,
        },
    };

    return (
        <>
            <FilterBox filters={filters} debounceMs={200} {...props} />
            <span data-testid="state">
                {JSON.stringify({
                    status,
                    tags,
                    owner,
                    name,
                    price,
                    created: created?.from?.getDate(),
                })}
            </span>
        </>
    );
}

const state = () => JSON.parse(screen.getByTestId('state').textContent ?? '{}');
const trigger = () => screen.getByRole('button', { name: /^Filter/ });
const row = (name: string) =>
    within(screen.getByRole('list', { name: 'Filters' }))
        .getAllByRole('button')
        .find((button) => button.textContent?.startsWith(name)) as HTMLElement;
const day = (label: string) =>
    within(screen.getByRole('grid'))
        .getAllByRole('button')
        .find((button) => button.textContent === label) as HTMLElement;

describe('FilterBox — trigger', () => {
    it('lines up with inputs: same height, corners, border and shadow', () => {
        render(<Harness initial={{ status: 'active' }} />);
        expect(trigger()).toHaveClass(
            'h-9',
            'rounded-md',
            'border-input/50',
            'shadow-xs',
        );
        expect(
            screen.getByRole('button', { name: 'Clear all filters' }),
        ).toHaveClass('size-9', 'rounded-md');
    });

    it('has rounded corners on both sides while it stands alone', () => {
        render(<Harness />);
        expect(trigger()).not.toHaveClass('rounded-e-none');
    });

    it('shows the reset X only while a filter is active', async () => {
        const user = userEvent.setup();
        const { unmount } = render(<Harness />);
        expect(
            screen.queryByRole('button', { name: 'Clear all filters' }),
        ).not.toBeInTheDocument();
        unmount();

        render(<Harness initial={{ status: 'active' }} />);
        expect(trigger()).toHaveClass('rounded-e-none');
        await user.click(
            screen.getByRole('button', { name: 'Clear all filters' }),
        );

        expect(state().status).toBeNull();
        expect(
            screen.queryByRole('button', { name: 'Clear all filters' }),
        ).not.toBeInTheDocument();
    });

    it('uses a custom reset', async () => {
        const user = userEvent.setup();
        const onReset = vi.fn();
        render(<Harness initial={{ status: 'active' }} onReset={onReset} />);

        await user.click(
            screen.getByRole('button', { name: 'Clear all filters' }),
        );

        expect(onReset).toHaveBeenCalled();
        expect(state().status).toBe('active');
    });

    it('can be disabled', () => {
        render(<Harness disabled />);
        expect(trigger()).toBeDisabled();
    });
});

describe('FilterBox — list', () => {
    it('lists every filter with compact rows', async () => {
        const user = userEvent.setup();
        render(<Harness />);
        await user.click(trigger());

        expect(
            screen.getByRole('dialog', { name: 'Filters' }),
        ).toBeInTheDocument();
        for (const name of [
            'Status',
            'Tags',
            'Owner',
            'Name',
            'Created',
            'Price',
        ]) {
            expect(row(name)).toHaveClass('py-1.5');
        }
    });

    it('summarizes values and counts multi-selections', async () => {
        const user = userEvent.setup();
        render(
            <Harness
                initial={{
                    status: 'paused',
                    tags: ['active', 'paused', 'closed'],
                }}
            />,
        );
        await user.click(trigger());

        expect(row('Status')).toHaveTextContent('Paused');
        expect(row('Tags')).toHaveTextContent('3 selected');
    });

    it('clears everything from the list header', async () => {
        const user = userEvent.setup();
        render(<Harness initial={{ status: 'active', tags: ['paused'] }} />);
        await user.click(trigger());

        await user.click(screen.getByRole('button', { name: 'Clear filters' }));

        expect(state()).toMatchObject({ status: null, tags: null });
    });

    it('moves between rows with the arrow keys', async () => {
        const user = userEvent.setup();
        render(<Harness />);
        await user.click(trigger());

        row('Status').focus();
        await user.keyboard('{ArrowDown}');

        expect(row('Tags')).toHaveFocus();
    });

    it('uses custom labels', async () => {
        const user = userEvent.setup();
        render(<Harness labels={{ trigger: 'فیلتر', title: 'فیلترها' }} />);
        await user.click(screen.getByRole('button', { name: /^فیلتر/ }));
        expect(
            screen.getByRole('dialog', { name: 'فیلترها' }),
        ).toBeInTheDocument();
    });
});

describe('FilterBox — filters', () => {
    it('picks from a multi-select without closing, then goes back', async () => {
        const user = userEvent.setup();
        render(<Harness />);
        await user.click(trigger());
        await user.click(row('Tags'));

        await user.click(screen.getByRole('combobox', { name: 'Tags' }));
        await user.click(screen.getByRole('option', { name: 'Active' }));
        await user.click(screen.getByRole('option', { name: 'Closed' }));
        await user.keyboard('{Escape}');
        expect(state().tags).toEqual(['active', 'closed']);

        await user.click(screen.getByRole('button', { name: 'Back' }));
        expect(row('Tags')).toHaveTextContent('Active, Closed');
    });

    it('picks from a searchable select without closing the filter popover', async () => {
        const user = userEvent.setup();
        render(<Harness />);
        await user.click(trigger());
        await user.click(row('Owner'));

        await user.click(screen.getByRole('combobox', { name: 'Owner' }));
        await user.click(screen.getByText('Paused'));

        expect(state().owner).toBe('paused');
        expect(
            screen.getByRole('dialog', { name: 'Filters' }),
        ).toBeInTheDocument();
    });

    it('goes back from the panel header, which spans the panel', async () => {
        const user = userEvent.setup();
        render(<Harness />);
        await user.click(trigger());
        await user.click(row('Name'));

        const header = screen.getByRole('button', { name: 'Back: Name' });
        expect(header).toHaveClass('w-full');
        await user.click(header);

        expect(
            screen.getByRole('list', { name: 'Filters' }),
        ).toBeInTheDocument();
    });

    it('picks a date range in the side calendar', async () => {
        const user = userEvent.setup();
        render(<Harness />);
        await user.click(trigger());
        await user.click(row('Created'));

        const field = screen.getByRole('button', { name: 'Created' });
        // Empty fields show no placeholder, just the underline.
        expect(field).toHaveTextContent(/^FromTo$/);
        expect(
            field.querySelector('[data-slot="date-filter-icon"]'),
        ).toHaveClass('size-8', 'group-hover:border-primary');
        await user.click(field);
        await user.click(day('10'));
        await user.click(day('14'));

        expect(state().created).toBe(10);
        expect(screen.queryByRole('grid')).not.toBeInTheDocument();
        expect(field).toHaveTextContent(/From10 .*To14 /);
    });

    it('returns to the list when reopened', async () => {
        const user = userEvent.setup();
        render(<Harness />);
        await user.click(trigger());
        await user.click(row('Name'));

        await user.keyboard('{Escape}');
        await user.click(trigger());

        expect(
            screen.getByRole('list', { name: 'Filters' }),
        ).toBeInTheDocument();
    });
});

describe('FilterBox — debounced filters', () => {
    beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
    afterEach(() => vi.useRealTimers());

    it('applies text after typing stops, and pending text when going back', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        render(<Harness />);
        await user.click(trigger());
        await user.click(row('Name'));

        await user.type(screen.getByRole('textbox', { name: 'Name' }), ' ada ');
        expect(state().name).toBeNull();
        act(() => vi.advanceTimersByTime(200));
        expect(state().name).toBe('ada');

        await user.type(screen.getByRole('textbox', { name: 'Name' }), 'x');
        await user.click(screen.getByRole('button', { name: 'Back' }));
        expect(state().name).toBe('ada x');
    });

    it('applies a number range after editing stops', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        render(<Harness />);
        await user.click(trigger());
        await user.click(row('Price'));

        await user.type(
            screen.getByRole('spinbutton', { name: 'Price: From' }),
            '250',
        );
        act(() => vi.advanceTimersByTime(200));

        expect(state().price).toEqual({ from: 250 });
    });

    it('drops pending text on reset', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        render(<Harness initial={{ status: 'active' }} />);
        await user.click(trigger());
        await user.click(row('Name'));
        await user.type(screen.getByRole('textbox', { name: 'Name' }), 'late');

        await user.click(
            screen.getByRole('button', { name: 'Clear all filters' }),
        );
        act(() => vi.advanceTimersByTime(200));

        expect(state()).toMatchObject({ status: null, name: null });
    });
});
