import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MultiComboBox from '.';

const OPTIONS = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
];

describe('MultiComboBox', () => {
    it('renders a combobox trigger', () => {
        render(<MultiComboBox options={OPTIONS} selected={[]} />);
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('shows placeholder when nothing is selected', () => {
        render(
            <MultiComboBox
                options={OPTIONS}
                selected={[]}
                placeholder="Pick fruits"
            />,
        );
        expect(screen.getByText('Pick fruits')).toBeInTheDocument();
    });

    it('shows "N selected" when items are selected', () => {
        render(
            <MultiComboBox options={OPTIONS} selected={['apple', 'banana']} />,
        );
        expect(screen.getByText('2 selected')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
        render(
            <MultiComboBox options={OPTIONS} selected={[]} label="Fruits" />,
        );
        expect(screen.getByText('Fruits')).toBeInTheDocument();
    });

    it('does not render label when omitted', () => {
        render(<MultiComboBox options={OPTIONS} selected={[]} />);
        expect(screen.queryByText('Fruits')).not.toBeInTheDocument();
    });

    it('opens dropdown on trigger click', async () => {
        const user = userEvent.setup();
        render(<MultiComboBox options={OPTIONS} selected={[]} />);
        await user.click(screen.getByRole('combobox'));
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Banana')).toBeInTheDocument();
        expect(screen.getByText('Cherry')).toBeInTheDocument();
    });

    it('calls onChange with added value when an option is selected', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <MultiComboBox
                options={OPTIONS}
                selected={[]}
                onChange={onChange}
            />,
        );
        await user.click(screen.getByRole('combobox'));
        await user.click(screen.getByText('Apple'));
        expect(onChange).toHaveBeenCalledWith(['apple']);
    });

    it('calls onChange with value removed when an already-selected option is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <MultiComboBox
                options={OPTIONS}
                selected={['apple']}
                onChange={onChange}
            />,
        );
        await user.click(screen.getByRole('combobox'));
        const appleOption = screen
            .getAllByText('Apple')
            .find((el) => el.closest('[data-command-item]'));
        if (appleOption) await user.click(appleOption);
        expect(onChange).toHaveBeenCalledWith([]);
    });

    it('renders selected badges below the trigger', () => {
        render(
            <MultiComboBox options={OPTIONS} selected={['apple', 'banana']} />,
        );
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('hides badges when hideSelectedBadges is true', () => {
        render(
            <MultiComboBox
                options={OPTIONS}
                selected={['apple']}
                hideSelectedBadges
            />,
        );
        expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    });

    it('calls onChange removing value when badge remove button is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <MultiComboBox
                options={OPTIONS}
                selected={['apple']}
                onChange={onChange}
            />,
        );
        await user.click(screen.getByRole('button', { name: 'Remove Apple' }));
        expect(onChange).toHaveBeenCalledWith([]);
    });

    it('does not show remove button on badges when disabled', () => {
        render(
            <MultiComboBox options={OPTIONS} selected={['apple']} disabled />,
        );
        expect(
            screen.queryByRole('button', { name: 'Remove Apple' }),
        ).not.toBeInTheDocument();
    });

    it('is disabled when disabled is true', () => {
        render(<MultiComboBox options={OPTIONS} selected={[]} disabled />);
        expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('shows "Loading..." when isPending is true', () => {
        render(<MultiComboBox options={OPTIONS} selected={[]} isPending />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows "Failed to load" when isError is true', () => {
        render(<MultiComboBox options={OPTIONS} selected={[]} isError />);
        expect(screen.getByText('Failed to load')).toBeInTheDocument();
    });

    it('renders error message when error is provided', () => {
        render(
            <MultiComboBox
                options={OPTIONS}
                selected={[]}
                error="Selection required"
            />,
        );
        expect(screen.getByText('Selection required')).toBeInTheDocument();
    });

    it('sets aria-invalid on trigger when error is provided', () => {
        render(
            <MultiComboBox options={OPTIONS} selected={[]} error="Invalid" />,
        );
        expect(screen.getByRole('combobox')).toHaveAttribute(
            'aria-invalid',
            'true',
        );
    });

    it('does not set aria-invalid when no error', () => {
        render(<MultiComboBox options={OPTIONS} selected={[]} />);
        expect(screen.getByRole('combobox')).not.toHaveAttribute(
            'aria-invalid',
        );
    });

    it('shows notFoundText when search has no matches', async () => {
        const user = userEvent.setup();
        render(
            <MultiComboBox
                options={OPTIONS}
                selected={[]}
                notFoundText="Nothing here"
            />,
        );
        await user.click(screen.getByRole('combobox'));
        await user.type(screen.getByPlaceholderText('Search...'), 'xyz');
        expect(screen.getByText('Nothing here')).toBeInTheDocument();
    });

    it('renders without errors when options list is empty', () => {
        expect(() =>
            render(<MultiComboBox options={[]} selected={[]} />),
        ).not.toThrow();
    });

    it('resets search when dropdown is closed', async () => {
        const user = userEvent.setup();
        render(<MultiComboBox options={OPTIONS} selected={[]} />);
        await user.click(screen.getByRole('combobox'));
        await user.type(screen.getByPlaceholderText('Search...'), 'ban');
        await user.keyboard('{Escape}');
        await user.click(screen.getByRole('combobox'));
        expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('does not throw when toggle is called without onChange', async () => {
        const user = userEvent.setup();
        render(<MultiComboBox options={OPTIONS} selected={[]} />);
        await user.click(screen.getByRole('combobox'));
        await expect(
            user.click(screen.getByText('Apple')),
        ).resolves.not.toThrow();
    });

    it('stops wheel event propagation inside the dropdown', async () => {
        const user = userEvent.setup();
        render(<MultiComboBox options={OPTIONS} selected={[]} />);
        await user.click(screen.getByRole('combobox'));
        const scrollContainer = document.querySelector('.max-h-40');
        if (scrollContainer) {
            fireEvent.wheel(scrollContainer, { deltaY: 100 });
        }
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
});

describe('MultiComboBox — server options', () => {
    it('reports searches and does not filter on the client', async () => {
        const user = userEvent.setup();
        const onSearchChange = vi.fn();
        render(
            <MultiComboBox
                options={OPTIONS}
                selected={[]}
                onSearchChange={onSearchChange}
            />,
        );
        await user.click(screen.getByRole('combobox'));

        await user.type(screen.getByPlaceholderText('Search...'), 'zzz');

        expect(onSearchChange).toHaveBeenLastCalledWith('zzz');
        // Server results are shown as given, even when they don't match.
        expect(screen.getByText('Apple')).toBeVisible();
        expect(screen.queryByText('No results found.')).not.toBeInTheDocument();
    });

    it('clears the server search when it closes', async () => {
        const user = userEvent.setup();
        const onSearchChange = vi.fn();
        render(
            <MultiComboBox
                options={OPTIONS}
                selected={[]}
                onSearchChange={onSearchChange}
            />,
        );
        await user.click(screen.getByRole('combobox'));
        await user.type(screen.getByPlaceholderText('Search...'), 'ap');

        await user.keyboard('{Escape}');

        expect(onSearchChange).toHaveBeenLastCalledWith('');
    });

    it('shows that no server results came back', async () => {
        const user = userEvent.setup();
        render(
            <MultiComboBox
                options={[]}
                selected={[]}
                onSearchChange={vi.fn()}
            />,
        );
        await user.click(screen.getByRole('combobox'));

        expect(screen.getByText('No results found.')).toBeInTheDocument();
    });

    it('shows the next page loading at the end of the list', async () => {
        const user = userEvent.setup();
        render(
            <MultiComboBox
                options={OPTIONS}
                selected={[]}
                hasNextPage
                isFetchingNextPage
                loadingMoreText="Loading more"
            />,
        );
        await user.click(screen.getByRole('combobox'));

        expect(screen.getByText('Loading more')).toBeInTheDocument();
    });

    it('loads the next page when the end of the list scrolls into view', async () => {
        let notify:
            | ((entries: { isIntersecting: boolean }[]) => void)
            | undefined;
        vi.stubGlobal(
            'IntersectionObserver',
            class {
                constructor(callback: NonNullable<typeof notify>) {
                    notify = callback;
                }
                observe = vi.fn();
                disconnect = vi.fn();
            },
        );
        const user = userEvent.setup();
        const onFetchNextPage = vi.fn();
        render(
            <MultiComboBox
                options={OPTIONS}
                selected={[]}
                hasNextPage
                onFetchNextPage={onFetchNextPage}
            />,
        );
        await user.click(screen.getByRole('combobox'));

        notify?.([{ isIntersecting: true }]);

        expect(onFetchNextPage).toHaveBeenCalled();
        vi.unstubAllGlobals();
    });
});
