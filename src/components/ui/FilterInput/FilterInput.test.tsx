import type { Filter } from '@/utils/funcs/filters';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterInput from '.';

const OPTIONS = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
];

const renderInput = (filter: Filter, labels = {}) =>
    render(<FilterInput filter={filter} labels={labels} />);

describe('FilterInput — select', () => {
    it('renders a plain select with a placeholder from the label', () => {
        renderInput({
            type: 'select',
            label: 'Status',
            options: OPTIONS,
            value: null,
            onChange: vi.fn(),
        });
        expect(
            screen.getByRole('combobox', { name: 'Status' }),
        ).toHaveTextContent('Select the status');
    });

    it('disables a loading select', () => {
        renderInput({
            type: 'select',
            label: 'Status',
            options: [],
            isPending: true,
            value: null,
            onChange: vi.fn(),
        });
        expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('uses a searchable combo box when asked, reporting null when cleared', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderInput({
            type: 'select',
            label: 'Owner',
            options: OPTIONS,
            searchable: true,
            value: 'a',
            onChange,
        });

        await user.click(screen.getByRole('combobox', { name: 'Owner' }));
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
        await user.click(screen.getByText('Beta'));
        expect(onChange).toHaveBeenLastCalledWith('b');
    });

    it('sends server searches and shows the next page loading', async () => {
        const user = userEvent.setup();
        const onSearchChange = vi.fn();
        renderInput({
            type: 'select',
            label: 'Owner',
            options: OPTIONS,
            value: null,
            onChange: vi.fn(),
            onSearchChange,
            hasNextPage: true,
            isFetchingNextPage: true,
        });

        await user.click(screen.getByRole('combobox', { name: 'Owner' }));
        await user.type(screen.getByPlaceholderText('Search'), 'x');

        expect(onSearchChange).toHaveBeenLastCalledWith('x');
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
});

describe('FilterInput — multiselect', () => {
    it('adds options and reports null once empty', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const { rerender } = renderInput({
            type: 'multiselect',
            label: 'Tags',
            options: OPTIONS,
            value: null,
            onChange,
        });

        await user.click(screen.getByRole('combobox', { name: 'Tags' }));
        await user.click(screen.getByRole('option', { name: 'Beta' }));
        expect(onChange).toHaveBeenLastCalledWith(['b']);

        rerender(
            <FilterInput
                filter={{
                    type: 'multiselect',
                    label: 'Tags',
                    options: OPTIONS,
                    value: ['b'],
                    onChange,
                }}
            />,
        );
        await user.click(screen.getByRole('option', { name: 'Beta' }));
        expect(onChange).toHaveBeenLastCalledWith(null);
    });

    it('shows its loading state', () => {
        renderInput({
            type: 'multiselect',
            label: 'Tags',
            options: [],
            isPending: true,
            value: null,
            onChange: vi.fn(),
        });
        expect(screen.getByRole('combobox')).toHaveTextContent('Loading...');
    });
});

describe('FilterInput — text, number range and date', () => {
    it.each([
        ['Persian', '۱۲'],
        ['Arabic', '١٢'],
    ])('converts %s digits in text to English', async (_, digits) => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderInput({ type: 'text', label: 'Code', value: null, onChange });

        await user.type(screen.getByRole('textbox', { name: 'Code' }), digits);

        expect(onChange).toHaveBeenCalledWith('1');
        expect(onChange).not.toHaveBeenCalledWith(digits[0]);
    });

    it('edits text', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderInput({ type: 'text', label: 'Name', value: null, onChange });

        await user.type(screen.getByRole('textbox', { name: 'Name' }), 'a');

        expect(onChange).toHaveBeenCalledWith('a');
        expect(screen.getByRole('textbox')).toHaveAttribute(
            'placeholder',
            'Search',
        );
    });

    it('uses a custom text placeholder', () => {
        renderInput({
            type: 'text',
            label: 'Name',
            placeholder: 'Type a name',
            value: '',
            onChange: vi.fn(),
        });
        expect(screen.getByRole('textbox')).toHaveAttribute(
            'placeholder',
            'Type a name',
        );
    });

    it('edits a number range with a slider', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderInput({
            type: 'number-range',
            label: 'Price',
            max: 100,
            value: { from: 10, to: 50 },
            onChange,
        });
        expect(screen.getAllByRole('slider')).toHaveLength(2);

        const to = screen.getByRole('spinbutton', { name: 'Price: To' });
        await user.clear(to);
        await user.type(to, '60');

        expect(onChange).toHaveBeenLastCalledWith({ from: 10, to: 60 });
    });

    it('uses custom labels', () => {
        renderInput(
            {
                type: 'number-range',
                label: 'قیمت',
                value: null,
                onChange: vi.fn(),
            },
            { from: 'از', to: 'تا' },
        );
        expect(
            screen.getByRole('spinbutton', { name: 'قیمت: از' }),
        ).toHaveAttribute('placeholder', 'از');
    });

    it('shows the range and picks a single day as a one-day range', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const day = new Date(2026, 0, 5);
        renderInput({
            type: 'date',
            label: 'Day',
            mode: 'single',
            value: { from: day, to: day },
            onChange,
        });

        expect(screen.getByRole('button', { name: 'Day' })).toHaveTextContent(
            '5 January',
        );
        await user.click(screen.getByRole('button', { name: 'Day' }));
        const twelve = within(screen.getByRole('grid'))
            .getAllByRole('button')
            .find((button) => button.textContent === '12');
        await user.click(twelve as HTMLElement);

        const range = onChange.mock.calls[0][0];
        expect(range.from.getDate()).toBe(12);
        expect(range.to.getDate()).toBe(12);
        expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });
});
