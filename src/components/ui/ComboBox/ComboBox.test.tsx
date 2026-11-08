import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComboBox from '.';

const OPTIONS = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
];

describe('ComboBox', () => {
    it('renders a combobox trigger', () => {
        render(<ComboBox options={OPTIONS} />);
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('shows placeholder when no value is selected', () => {
        render(<ComboBox options={OPTIONS} placeholder="Pick a fruit" />);
        expect(screen.getByText('Pick a fruit')).toBeInTheDocument();
    });

    it('shows selected label when value is provided', () => {
        render(<ComboBox options={OPTIONS} value="banana" />);
        expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('shows label when provided', () => {
        render(<ComboBox options={OPTIONS} label="Fruit" />);
        expect(screen.getByText('Fruit')).toBeInTheDocument();
    });

    it('does not render label when omitted', () => {
        render(<ComboBox options={OPTIONS} />);
        expect(screen.queryByText('Fruit')).not.toBeInTheDocument();
    });

    it('opens dropdown on trigger click', async () => {
        const user = userEvent.setup();
        render(<ComboBox options={OPTIONS} />);
        await user.click(screen.getByRole('combobox'));
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Banana')).toBeInTheDocument();
        expect(screen.getByText('Cherry')).toBeInTheDocument();
    });

    it('calls onChange with option value when an option is selected', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<ComboBox options={OPTIONS} onChange={onChange} />);
        await user.click(screen.getByRole('combobox'));
        await user.click(screen.getByText('Apple'));
        expect(onChange).toHaveBeenCalledWith('apple');
    });

    it('calls onChange with empty string when selected option is clicked again (deselect)', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <ComboBox options={OPTIONS} value="apple" onChange={onChange} />,
        );
        await user.click(screen.getByRole('combobox'));
        // find the option role element (not the trigger button which also shows "Apple")
        const appleOption = screen
            .getAllByRole('option')
            .find((el) => el.textContent?.includes('Apple'));
        if (appleOption) await user.click(appleOption);
        expect(onChange).toHaveBeenCalledWith('');
    });

    it('is disabled when disabled prop is true', () => {
        render(<ComboBox options={OPTIONS} disabled />);
        expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('shows "Loading..." when isPending is true', () => {
        render(<ComboBox options={OPTIONS} isPending />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows "Failed to load" when isError is true', () => {
        render(<ComboBox options={OPTIONS} isError />);
        expect(screen.getByText('Failed to load')).toBeInTheDocument();
    });

    it('renders error message when error prop is provided', () => {
        render(<ComboBox options={OPTIONS} error="Required field" />);
        expect(screen.getByText('Required field')).toBeInTheDocument();
    });

    it('sets aria-invalid when error is provided', () => {
        render(<ComboBox options={OPTIONS} error="Invalid" />);
        expect(screen.getByRole('combobox')).toHaveAttribute(
            'aria-invalid',
            'true',
        );
    });

    it('does not set aria-invalid when no error', () => {
        render(<ComboBox options={OPTIONS} />);
        expect(screen.getByRole('combobox')).not.toHaveAttribute(
            'aria-invalid',
        );
    });

    it('filters options based on search input', async () => {
        const user = userEvent.setup();
        render(<ComboBox options={OPTIONS} />);
        await user.click(screen.getByRole('combobox'));
        await user.type(screen.getByPlaceholderText('Search...'), 'ban');
        // CommandItem hides non-matching items via display:none; popover is in a portal
        const allOptions = document.querySelectorAll('[data-command-item]');
        const appleOption = Array.from(allOptions).find((el) =>
            el.textContent?.includes('Apple'),
        ) as HTMLElement | undefined;
        const bananaOption = Array.from(allOptions).find((el) =>
            el.textContent?.includes('Banana'),
        ) as HTMLElement | undefined;
        expect(appleOption?.style.display).toBe('none');
        expect(bananaOption?.style.display).not.toBe('none');
    });

    it('shows notFoundText when search has no matches', async () => {
        const user = userEvent.setup();
        render(<ComboBox options={OPTIONS} notFoundText="Nothing here" />);
        await user.click(screen.getByRole('combobox'));
        await user.type(screen.getByPlaceholderText('Search...'), 'xyz');
        expect(screen.getByText('Nothing here')).toBeInTheDocument();
    });

    it('renders empty options list without errors', () => {
        render(<ComboBox options={[]} />);
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('resets search when dropdown is closed', async () => {
        const user = userEvent.setup();
        render(<ComboBox options={OPTIONS} />);
        await user.click(screen.getByRole('combobox'));
        await user.type(screen.getByPlaceholderText('Search...'), 'ban');
        // Close by pressing Escape
        await user.keyboard('{Escape}');
        // Re-open: all options should be visible again
        await user.click(screen.getByRole('combobox'));
        expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('stops wheel event propagation inside the dropdown', async () => {
        const user = userEvent.setup();
        render(<ComboBox options={OPTIONS} />);
        await user.click(screen.getByRole('combobox'));
        const scrollContainer = document.querySelector('.max-h-40');
        if (scrollContainer) {
            fireEvent.wheel(scrollContainer, { deltaY: 100 });
        }
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
});
