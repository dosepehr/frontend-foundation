import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import DataFilter from '.';
import type { DataFilterProps } from './DataFilter.types';

const SORT_OPTIONS = [
    { value: '-created_at', label: 'Newest' },
    { value: 'created_at', label: 'Oldest' },
];

type HarnessProps = Omit<DataFilterProps, 'search'> & {
    initialSearch?: string;
    ordering?: string | null;
};

function Harness({
    initialSearch = '',
    ordering: initialOrdering = null,
    ...props
}: HarnessProps) {
    const [search, setSearch] = useState(initialSearch);
    const [ordering, setOrdering] = useState<string | null>(initialOrdering);
    const [status, setStatus] = useState<string | null>(null);
    return (
        <>
            <DataFilter
                search={{ value: search, onChange: setSearch, debounceMs: 200 }}
                filters={{
                    status: {
                        type: 'select',
                        label: 'Status',
                        options: [{ value: 'active', label: 'Active' }],
                        value: status,
                        onChange: setStatus,
                    },
                }}
                sort={{
                    value: ordering,
                    onChange: setOrdering,
                    options: SORT_OPTIONS,
                }}
                {...props}
            />
            <span data-testid="state">
                {JSON.stringify({ search, ordering, status })}
            </span>
        </>
    );
}

const state = () => JSON.parse(screen.getByTestId('state').textContent ?? '{}');

describe('DataFilter — layout', () => {
    it('renders search, filter and sort', () => {
        render(<Harness />);
        expect(
            screen.getByRole('searchbox', { name: 'Search' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /^Filter/ }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('combobox', { name: 'Sort' }),
        ).toBeInTheDocument();
    });

    it('shows only the controls it is given', () => {
        render(<DataFilter search={{ value: '', onChange: vi.fn() }} />);
        expect(screen.getByRole('searchbox')).toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: /^Filter/ }),
        ).not.toBeInTheDocument();
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    it('hides filters with none and sorting with no options', () => {
        render(
            <Harness
                filters={{}}
                sort={{ value: null, onChange: vi.fn(), options: [] }}
            />,
        );
        expect(
            screen.queryByRole('button', { name: /^Filter/ }),
        ).not.toBeInTheDocument();
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    it('disables the search box and uses its placeholder', () => {
        render(
            <DataFilter
                search={{
                    value: '',
                    onChange: vi.fn(),
                    disabled: true,
                    placeholder: 'Find',
                }}
            />,
        );
        expect(screen.getByRole('searchbox', { name: 'Find' })).toBeDisabled();
    });

    it('adds guided-tour anchors', () => {
        const { container } = render(
            <Harness tourIds={{ search: 'search', filters: 'filters' }} />,
        );
        expect(
            container.querySelector('[data-tour="search"]'),
        ).toContainElement(screen.getByRole('searchbox'));
        expect(
            container.querySelector('[data-tour="filters"]'),
        ).toBeInTheDocument();
    });

    it('passes extra FilterBox props through', async () => {
        const user = userEvent.setup();
        const onReset = vi.fn();
        render(
            <DataFilter
                filters={{
                    name: {
                        type: 'text',
                        label: 'Name',
                        value: 'ada',
                        onChange: vi.fn(),
                    },
                }}
                filterBox={{ onReset }}
            />,
        );
        await user.click(
            screen.getByRole('button', { name: 'Clear all filters' }),
        );
        expect(onReset).toHaveBeenCalled();
    });

    it('uses Persian texts with locale="fa"', () => {
        render(
            <DataFilter
                locale="fa"
                search={{ value: '', onChange: vi.fn() }}
                filters={{
                    name: {
                        type: 'text',
                        label: 'نام',
                        value: null,
                        onChange: vi.fn(),
                    },
                }}
                sort={{ value: null, onChange: vi.fn(), options: SORT_OPTIONS }}
            />,
        );
        expect(
            screen.getByRole('searchbox', { name: 'جستجو' }),
        ).toHaveAttribute('placeholder', 'جستجو');
        expect(
            screen.getByRole('button', { name: /^فیلتر/ }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('combobox', { name: 'مرتب سازی' }),
        ).toBeInTheDocument();
    });

    it('lets labels and the search placeholder override the locale', () => {
        render(
            <DataFilter
                locale="fa"
                labels={{ sort: 'ترتیب' }}
                search={{
                    value: '',
                    onChange: vi.fn(),
                    placeholder: 'جستجو نام...',
                }}
                sort={{ value: null, onChange: vi.fn(), options: SORT_OPTIONS }}
            />,
        );
        expect(
            screen.getByRole('searchbox', { name: 'جستجو نام...' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('combobox', { name: 'ترتیب' }),
        ).toBeInTheDocument();
    });
});

describe('DataFilter — search', () => {
    beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
    afterEach(() => vi.useRealTimers());

    it('applies the search after typing stops, converting Persian digits', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        render(<Harness />);

        await user.type(screen.getByRole('searchbox'), 'ada ۰۹۱۲');
        expect(state().search).toBe('');

        act(() => vi.advanceTimersByTime(200));
        expect(state().search).toBe('ada 0912');
    });

    it('clears right away', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        render(<Harness initialSearch="old" />);

        await user.click(screen.getByRole('button', { name: 'Clear search' }));

        expect(state().search).toBe('');
        expect(screen.getByRole('searchbox')).toHaveFocus();
    });

    it('follows a search changed from outside', () => {
        const { rerender } = render(
            <DataFilter search={{ value: 'one', onChange: vi.fn() }} />,
        );
        rerender(<DataFilter search={{ value: 'two', onChange: vi.fn() }} />);
        expect(screen.getByRole('searchbox')).toHaveValue('two');
    });
});

describe('DataFilter — sort and filters', () => {
    it('changes the ordering', async () => {
        const user = userEvent.setup();
        render(<Harness />);

        await user.click(screen.getByRole('combobox', { name: 'Sort' }));
        await user.click(screen.getByRole('option', { name: 'Oldest' }));

        expect(state().ordering).toBe('created_at');
        expect(
            screen.getByRole('combobox', { name: 'Sort' }),
        ).toHaveTextContent('Sort:Oldest');
    });

    it('resets filters without touching search or ordering', async () => {
        const user = userEvent.setup();
        render(<Harness initialSearch="keep" ordering="-created_at" />);
        await user.click(screen.getByRole('button', { name: /^Filter/ }));
        await user.click(screen.getByRole('button', { name: /^Status/ }));
        await user.click(screen.getByRole('combobox', { name: 'Status' }));
        await user.click(screen.getByRole('option', { name: 'Active' }));
        expect(state().status).toBe('active');

        await user.click(
            screen.getByRole('button', { name: 'Clear all filters' }),
        );

        expect(state()).toEqual({
            search: 'keep',
            ordering: '-created_at',
            status: null,
        });
    });
});
