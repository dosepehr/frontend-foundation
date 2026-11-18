import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import SearchInput from '.';

const getInput = () => screen.getByRole<HTMLInputElement>('searchbox');

describe('SearchInput — rendering', () => {
    it('renders a search box with the default placeholder', () => {
        render(<SearchInput />);
        expect(getInput()).toHaveAttribute('type', 'search');
        expect(getInput()).toHaveAttribute('placeholder', 'Search');
    });

    it('renders the label from Input', () => {
        render(<SearchInput label="Find users" />);
        expect(screen.getByLabelText('Find users')).toBe(getInput());
    });

    it('shows the search button, not clear, while empty', () => {
        render(<SearchInput />);
        expect(
            screen.getByRole('button', { name: 'Search' }),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: 'Clear search' }),
        ).not.toBeInTheDocument();
    });

    it('shows a spinner instead of the clear button while loading', () => {
        render(<SearchInput defaultValue="abc" isLoading />);
        expect(screen.getByLabelText('Loading')).toBeInTheDocument();
        expect(getInput()).toHaveAttribute('aria-busy', 'true');
        expect(
            screen.queryByRole('button', { name: 'Clear search' }),
        ).not.toBeInTheDocument();
    });

    it('never offers to clear when disabled or read-only', () => {
        const { rerender } = render(<SearchInput defaultValue="a" disabled />);
        expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();

        rerender(<SearchInput defaultValue="a" readOnly />);
        expect(
            screen.queryByRole('button', { name: 'Clear search' }),
        ).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Search' })).toBeEnabled();
    });

    it('has one end button: search while empty, clear with text', async () => {
        const user = userEvent.setup();
        const { container } = render(<SearchInput />);
        expect(
            container.querySelectorAll('[data-slot="search-input-action"]'),
        ).toHaveLength(1);

        await user.click(screen.getByRole('button', { name: 'Search' }));
        expect(getInput()).toHaveFocus();

        await user.type(getInput(), 'a');
        expect(
            screen.queryByRole('button', { name: 'Search' }),
        ).not.toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Clear search' }));
        expect(getInput()).toHaveValue('');
        expect(
            screen.getByRole('button', { name: 'Search' }),
        ).toBeInTheDocument();
    });

    it('uses custom button labels', () => {
        const { unmount } = render(<SearchInput searchLabel="جستجو" />);
        expect(
            screen.getByRole('button', { name: 'جستجو' }),
        ).toBeInTheDocument();
        unmount();

        render(<SearchInput clearLabel="پاک کردن" defaultValue="a" />);
        expect(
            screen.getByRole('button', { name: 'پاک کردن' }),
        ).toBeInTheDocument();
    });

    it('forwards its ref to the input', () => {
        const ref = { current: null as HTMLInputElement | null };
        render(<SearchInput ref={ref} />);
        expect(ref.current).toBe(getInput());
    });
});

describe('SearchInput — searching', () => {
    beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
    afterEach(() => vi.useRealTimers());

    it('reports every keystroke and searches once after the delay', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        const onValueChange = vi.fn();
        const onSearch = vi.fn();
        render(
            <SearchInput
                onValueChange={onValueChange}
                onSearch={onSearch}
                debounceMs={300}
            />,
        );

        await user.type(getInput(), 'abc');
        expect(onValueChange).toHaveBeenCalledTimes(3);
        expect(onSearch).not.toHaveBeenCalled();

        act(() => vi.advanceTimersByTime(300));
        expect(onSearch).toHaveBeenCalledTimes(1);
        expect(onSearch).toHaveBeenCalledWith('abc');
    });

    it('searches immediately on Enter', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        const onSearch = vi.fn();
        render(<SearchInput onSearch={onSearch} debounceMs={1000} />);

        await user.type(getInput(), 'go{Enter}');
        expect(onSearch).toHaveBeenCalledWith('go');

        act(() => vi.advanceTimersByTime(1000));
        expect(onSearch).toHaveBeenCalledTimes(1);
    });

    it('clears with the button, searches for empty text and refocuses', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        const onSearch = vi.fn();
        render(<SearchInput defaultValue="old" onSearch={onSearch} />);

        await user.click(screen.getByRole('button', { name: 'Clear search' }));

        expect(getInput()).toHaveValue('');
        expect(onSearch).toHaveBeenCalledWith('');
        expect(getInput()).toHaveFocus();
    });

    it('clears on Escape', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        const onSearch = vi.fn();
        render(<SearchInput onSearch={onSearch} />);

        await user.type(getInput(), 'abc{Escape}');

        expect(getInput()).toHaveValue('');
        act(() => vi.advanceTimersByTime(300));
        expect(onSearch).toHaveBeenCalledTimes(1);
        expect(onSearch).toHaveBeenCalledWith('');
    });

    it('ignores Escape while empty', () => {
        const onSearch = vi.fn();
        render(<SearchInput onSearch={onSearch} />);

        fireEvent.keyDown(getInput(), { key: 'Escape' });

        expect(onSearch).not.toHaveBeenCalled();
    });

    it('lets a custom onKeyDown cancel the default handling', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        const onSearch = vi.fn();
        render(
            <SearchInput
                onSearch={onSearch}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') event.preventDefault();
                }}
            />,
        );

        await user.type(getInput(), 'x{Enter}');

        expect(onSearch).not.toHaveBeenCalled();
    });

    it('works as a controlled input', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        function Controlled() {
            const [value, setValue] = useState('start');
            return (
                <>
                    <SearchInput value={value} onValueChange={setValue} />
                    <output>{value}</output>
                </>
            );
        }
        render(<Controlled />);

        await user.type(getInput(), '!');
        expect(screen.getByRole('status')).toHaveTextContent('start!');

        await user.click(screen.getByRole('button', { name: 'Clear search' }));
        expect(screen.getByRole('status')).toHaveTextContent('');
    });
});

describe('SearchInput — digits', () => {
    it('converts Persian and Arabic digits by default', async () => {
        const user = userEvent.setup();
        render(<SearchInput />);

        await user.type(getInput(), '۰۹۱۲٣');

        expect(getInput()).toHaveValue('09123');
    });

    it('keeps digits as typed without normalizeDigits', async () => {
        const user = userEvent.setup();
        render(<SearchInput normalizeDigits={false} />);

        await user.type(getInput(), '۱۲');

        expect(getInput()).toHaveValue('۱۲');
    });
});
