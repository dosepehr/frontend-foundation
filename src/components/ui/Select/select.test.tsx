import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectGroup,
    SelectLabel,
    SelectSeparator,
} from './components';

describe('Select', () => {
    function renderSelect(props?: Partial<React.ComponentProps<typeof Select>>) {
        return render(
            <Select {...props}>
                <SelectTrigger>
                    <SelectValue placeholder='Pick one' />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='apple'>Apple</SelectItem>
                    <SelectItem value='banana'>Banana</SelectItem>
                </SelectContent>
            </Select>,
        );
    }

    it('renders the trigger without errors', () => {
        renderSelect();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('shows placeholder text', () => {
        renderSelect();
        expect(screen.getByText('Pick one')).toBeInTheDocument();
    });

    it('trigger has data-slot="select-trigger"', () => {
        const { container } = renderSelect();
        expect(container.querySelector('[data-slot="select-trigger"]')).toBeInTheDocument();
    });

    it('content is not visible by default', () => {
        renderSelect();
        expect(document.querySelector('[data-slot="select-content"]')).not.toBeInTheDocument();
    });

    it('opens content on trigger click', async () => {
        const user = userEvent.setup();
        renderSelect();
        await user.click(screen.getByRole('combobox'));
        expect(document.querySelector('[data-slot="select-content"]')).toBeInTheDocument();
    });

    it('shows items when open', async () => {
        const user = userEvent.setup();
        renderSelect();
        await user.click(screen.getByRole('combobox'));
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('calls onValueChange when item is selected', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        renderSelect({ onValueChange });
        await user.click(screen.getByRole('combobox'));
        await user.click(screen.getByText('Apple'));
        expect(onValueChange).toHaveBeenCalledWith('apple');
    });

    it('trigger is disabled when disabled prop is true', () => {
        renderSelect({ disabled: true });
        expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('renders SelectGroup and SelectLabel without errors', () => {
        expect(() =>
            render(
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder='Pick' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value='apple'>Apple</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>,
            ),
        ).not.toThrow();
    });

    it('renders SelectSeparator without errors', () => {
        expect(() =>
            render(
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder='Pick' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='a'>A</SelectItem>
                        <SelectSeparator />
                        <SelectItem value='b'>B</SelectItem>
                    </SelectContent>
                </Select>,
            ),
        ).not.toThrow();
    });
});
