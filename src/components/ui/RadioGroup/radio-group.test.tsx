import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup, RadioGroupItem } from './components';
import RadioGroupWrapper from '.';

describe('RadioGroup', () => {
    it('has data-slot="radio-group"', () => {
        const { container } = render(
            <RadioGroup>
                <RadioGroupItem value='a' />
            </RadioGroup>,
        );
        expect(container.querySelector('[data-slot="radio-group"]')).toBeInTheDocument();
    });

    it('renders children', () => {
        render(
            <RadioGroup>
                <RadioGroupItem value='a' />
                <RadioGroupItem value='b' />
            </RadioGroup>,
        );
        expect(document.querySelectorAll('[data-slot="radio-group-item"]')).toHaveLength(2);
    });

    it('RadioGroupItem has data-slot="radio-group-item"', () => {
        const { container } = render(
            <RadioGroup>
                <RadioGroupItem value='a' />
            </RadioGroup>,
        );
        expect(container.querySelector('[data-slot="radio-group-item"]')).toBeInTheDocument();
    });

    it('selecting an item calls onValueChange', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(
            <RadioGroup onValueChange={onValueChange}>
                <RadioGroupItem value='option-a' />
            </RadioGroup>,
        );
        await user.click(document.querySelector('[data-slot="radio-group-item"]')!);
        expect(onValueChange).toHaveBeenCalledWith('option-a');
    });

    it('item is checked when value matches', () => {
        const { container } = render(
            <RadioGroup value='a' onValueChange={() => {}}>
                <RadioGroupItem value='a' />
            </RadioGroup>,
        );
        expect(container.querySelector('[data-slot="radio-group-item"]')).toHaveAttribute('data-state', 'checked');
    });

    it('item is unchecked when value does not match', () => {
        const { container } = render(
            <RadioGroup value='b' onValueChange={() => {}}>
                <RadioGroupItem value='a' />
            </RadioGroup>,
        );
        expect(container.querySelector('[data-slot="radio-group-item"]')).toHaveAttribute('data-state', 'unchecked');
    });

    it('item is disabled when disabled prop is set', () => {
        const { container } = render(
            <RadioGroup>
                <RadioGroupItem value='a' disabled />
            </RadioGroup>,
        );
        expect(container.querySelector('[data-slot="radio-group-item"]')).toBeDisabled();
    });
});

describe('RadioGroupWrapper', () => {
    const options = [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'cherry', label: 'Cherry' },
    ];

    it('renders all option labels', () => {
        render(<RadioGroupWrapper options={options} />);
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Banana')).toBeInTheDocument();
        expect(screen.getByText('Cherry')).toBeInTheDocument();
    });

    it('renders descriptions when provided', () => {
        render(
            <RadioGroupWrapper
                options={[{ value: 'a', label: 'Option A', description: 'Desc A' }]}
            />,
        );
        expect(screen.getByText('Desc A')).toBeInTheDocument();
    });

    it('calls onValueChange when an option is selected', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<RadioGroupWrapper options={options} onValueChange={onValueChange} />);
        await user.click(document.querySelectorAll('[data-slot="radio-group-item"]')[0]!);
        expect(onValueChange).toHaveBeenCalledWith('apple');
    });

    it('renders with empty options without errors', () => {
        expect(() => render(<RadioGroupWrapper options={[]} />)).not.toThrow();
    });

    it('disables all items when disabled prop is true', () => {
        render(<RadioGroupWrapper options={options} disabled />);
        const items = document.querySelectorAll('[data-slot="radio-group-item"]');
        items.forEach((item) => expect(item).toBeDisabled());
    });

    it('disables individual item when option.disabled is true', () => {
        render(
            <RadioGroupWrapper
                options={[
                    { value: 'a', label: 'A', disabled: true },
                    { value: 'b', label: 'B' },
                ]}
            />,
        );
        const items = document.querySelectorAll('[data-slot="radio-group-item"]');
        expect(items[0]).toBeDisabled();
        expect(items[1]).not.toBeDisabled();
    });
});
