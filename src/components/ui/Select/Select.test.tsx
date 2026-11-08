import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectWrapper from '.';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from './components';

describe('Select', () => {
    function renderSelect(
        props?: Partial<React.ComponentProps<typeof Select>>,
    ) {
        return render(
            <Select {...props}>
                <SelectTrigger>
                    <SelectValue placeholder="Pick one" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
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
        expect(
            container.querySelector('[data-slot="select-trigger"]'),
        ).toBeInTheDocument();
    });

    it('content is not visible by default', () => {
        renderSelect();
        expect(
            document.querySelector('[data-slot="select-content"]'),
        ).not.toBeInTheDocument();
    });

    it('opens content on trigger click', async () => {
        const user = userEvent.setup();
        renderSelect();
        await user.click(screen.getByRole('combobox'));
        expect(
            document.querySelector('[data-slot="select-content"]'),
        ).toBeInTheDocument();
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
                        <SelectValue placeholder="Pick" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
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
                        <SelectValue placeholder="Pick" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="a">A</SelectItem>
                        <SelectSeparator />
                        <SelectItem value="b">B</SelectItem>
                    </SelectContent>
                </Select>,
            ),
        ).not.toThrow();
    });
});

describe('SelectWrapper', () => {
    const options = [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
    ];

    it('renders without errors', () => {
        expect(() => render(<SelectWrapper options={options} />)).not.toThrow();
    });

    it('renders label when provided', () => {
        render(<SelectWrapper options={options} label="Pick a fruit" />);
        expect(screen.getByText('Pick a fruit')).toBeInTheDocument();
    });

    it('renders description when provided', () => {
        render(
            <SelectWrapper
                options={options}
                description="Choose your favourite fruit"
            />,
        );
        expect(
            screen.getByText('Choose your favourite fruit'),
        ).toBeInTheDocument();
    });

    it('renders error message when provided', () => {
        render(<SelectWrapper options={options} error="Selection required" />);
        expect(screen.getByText('Selection required')).toBeInTheDocument();
    });

    it('renders the trigger', () => {
        render(<SelectWrapper options={options} />);
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders options when opened', async () => {
        const user = userEvent.setup();
        render(<SelectWrapper options={options} />);
        await user.click(screen.getByRole('combobox'));
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('calls onValueChange when an option is selected', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(
            <SelectWrapper options={options} onValueChange={onValueChange} />,
        );
        await user.click(screen.getByRole('combobox'));
        await user.click(screen.getByText('Apple'));
        expect(onValueChange).toHaveBeenCalledWith('apple');
    });

    it('shows "No options available" when options is empty', async () => {
        const user = userEvent.setup();
        render(<SelectWrapper options={[]} />);
        await user.click(screen.getByRole('combobox'));
        expect(screen.getByText('No options available')).toBeInTheDocument();
    });

    it('shows loading placeholder when isLoading is true', () => {
        render(<SelectWrapper options={options} isLoading />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows error placeholder when isError is true', () => {
        render(<SelectWrapper options={options} isError />);
        expect(screen.getByText('Failed to load')).toBeInTheDocument();
    });
});
