import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import NumberInput from '.';
import type { NumberInputProps } from './NumberInput.types';

const getInput = () => screen.getByRole<HTMLInputElement>('spinbutton');

function Controlled(props: NumberInputProps) {
    const [value, setValue] = useState<number | null>(props.value ?? null);
    return (
        <>
            <NumberInput {...props} value={value} onValueChange={setValue} />
            <output data-testid="value">{String(value)}</output>
        </>
    );
}

describe('NumberInput — rendering', () => {
    it('renders a text input with the spinbutton role', () => {
        render(<NumberInput />);
        const input = getInput();
        expect(input).toHaveAttribute('type', 'text');
        expect(input).toHaveAttribute('autocomplete', 'off');
    });

    it('uses a decimal keyboard, or numeric when decimals are disabled', () => {
        const { rerender } = render(<NumberInput />);
        expect(getInput()).toHaveAttribute('inputmode', 'decimal');

        rerender(<NumberInput decimalScale={0} />);
        expect(getInput()).toHaveAttribute('inputmode', 'numeric');
    });

    it('renders the label, description and error from Input', () => {
        render(
            <NumberInput
                label="Quantity"
                description="How many items"
                error="Too many"
            />,
        );
        expect(screen.getByLabelText('Quantity')).toBe(getInput());
        expect(screen.getByText('How many items')).toBeInTheDocument();
        expect(screen.getByText('Too many')).toBeInTheDocument();
        expect(getInput()).toHaveAttribute('aria-invalid', 'true');
    });

    it('exposes value and bounds to assistive technology', () => {
        render(<NumberInput defaultValue={5} min={0} max={10} />);
        const input = getInput();
        expect(input).toHaveAttribute('aria-valuenow', '5');
        expect(input).toHaveAttribute('aria-valuemin', '0');
        expect(input).toHaveAttribute('aria-valuemax', '10');
    });

    it('renders the stepper by default and hides it on request', () => {
        const { rerender } = render(<NumberInput />);
        expect(screen.getByLabelText('Increment')).toBeInTheDocument();
        expect(screen.getByLabelText('Decrement')).toBeInTheDocument();

        rerender(<NumberInput showStepper={false} />);
        expect(screen.queryByLabelText('Increment')).not.toBeInTheDocument();
    });

    it('renders an end addon next to the stepper', () => {
        const { rerender } = render(<NumberInput endAddon="kg" />);
        expect(screen.getByText('kg')).toBeInTheDocument();
        expect(screen.getByLabelText('Increment')).toBeInTheDocument();

        rerender(<NumberInput endAddon="kg" showStepper={false} />);
        expect(screen.getByText('kg')).toBeInTheDocument();
    });

    it('passes extra props to the input', () => {
        render(<NumberInput placeholder="Enter the quantity" id="qty" />);
        expect(getInput()).toHaveAttribute('placeholder', 'Enter the quantity');
        expect(getInput()).toHaveAttribute('id', 'qty');
    });

    it('forwards its ref to the input element', () => {
        const ref = { current: null as HTMLInputElement | null };
        render(<NumberInput ref={ref} />);
        expect(ref.current).toBe(getInput());
    });
});

describe('NumberInput — hint', () => {
    it('renders a static hint', () => {
        render(<NumberInput hint="Whole numbers only" />);
        expect(screen.getByText('Whole numbers only')).toBeInTheDocument();
    });

    it('renders a hint computed from the current value', async () => {
        const user = userEvent.setup();
        render(
            <NumberInput
                hint={(value) =>
                    value === null ? 'Empty' : `Double: ${value * 2}`
                }
            />,
        );
        expect(screen.getByText('Empty')).toBeInTheDocument();

        await user.type(getInput(), '21');

        expect(screen.getByText('Double: 42')).toBeInTheDocument();
    });
});

describe('NumberInput — typing', () => {
    it('accepts digits and drops other characters', async () => {
        const user = userEvent.setup();
        render(<NumberInput />);

        await user.type(getInput(), '1a2b.3c');

        expect(getInput()).toHaveValue('12.3');
    });

    it('reports the parsed number', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<NumberInput onValueChange={onValueChange} />);

        await user.type(getInput(), '42');

        expect(onValueChange).toHaveBeenLastCalledWith(42);
    });

    it('groups thousands while typing', async () => {
        const user = userEvent.setup();
        render(<NumberInput thousandSeparator="," />);

        await user.type(getInput(), '1234567');

        expect(getInput()).toHaveValue('1,234,567');
    });

    it('keeps the caret in place when typing mid-number', async () => {
        const user = userEvent.setup();
        render(<NumberInput thousandSeparator="," defaultValue={1234} />);
        const input = getInput();

        // Caret between "2" and "3" of "1,234".
        await user.click(input);
        input.setSelectionRange(3, 3);
        await user.keyboard('5');

        expect(input).toHaveValue('12,534');
        expect(input.selectionStart).toBe(4);
    });

    it('deletes the digit behind a separator on Backspace', async () => {
        const user = userEvent.setup();
        render(<NumberInput thousandSeparator="," defaultValue={1234} />);
        const input = getInput();

        await user.click(input);
        input.setSelectionRange(2, 2);
        await user.keyboard('{Backspace}');

        expect(input).toHaveValue('234');
    });

    it('converts Persian digits', async () => {
        const user = userEvent.setup();
        render(<NumberInput />);

        await user.type(getInput(), '۱۲۳');

        expect(getInput()).toHaveValue('123');
    });

    it('limits decimals to decimalScale', async () => {
        const user = userEvent.setup();
        render(<NumberInput decimalScale={2} />);

        await user.type(getInput(), '3.14159');

        expect(getInput()).toHaveValue('3.14');
    });

    it('rejects a minus sign when min is not negative', async () => {
        const user = userEvent.setup();
        render(<NumberInput min={0} />);

        await user.type(getInput(), '-5');

        expect(getInput()).toHaveValue('5');
    });

    it('works as a controlled input', async () => {
        const user = userEvent.setup();
        render(<Controlled value={10} />);

        await user.clear(getInput());
        await user.type(getInput(), '25');

        expect(screen.getByTestId('value')).toHaveTextContent('25');
    });
});

describe('NumberInput — stepping and bounds', () => {
    it('steps with the arrow keys', async () => {
        const user = userEvent.setup();
        render(<NumberInput defaultValue={5} step={5} />);

        await user.click(getInput());
        await user.keyboard('{ArrowUp}{ArrowUp}{ArrowDown}');

        expect(getInput()).toHaveValue('10');
    });

    it('steps with the stepper buttons', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<NumberInput defaultValue={1} onValueChange={onValueChange} />);

        await user.click(screen.getByLabelText('Increment'));
        await user.click(screen.getByLabelText('Increment'));
        await user.click(screen.getByLabelText('Decrement'));

        expect(getInput()).toHaveValue('2');
        expect(onValueChange).toHaveBeenLastCalledWith(2);
    });

    it('disables the stepper buttons at the bounds', () => {
        const { rerender } = render(
            <NumberInput value={10} min={0} max={10} />,
        );
        expect(screen.getByLabelText('Increment')).toBeDisabled();
        expect(screen.getByLabelText('Decrement')).toBeEnabled();

        rerender(<NumberInput value={0} min={0} max={10} />);
        expect(screen.getByLabelText('Decrement')).toBeDisabled();
    });

    it('clamps to the bounds on blur', async () => {
        const user = userEvent.setup();
        render(<NumberInput min={1} max={100} />);

        await user.type(getInput(), '500');
        await user.tab();

        expect(getInput()).toHaveValue('100');
    });

    it('pads decimals on blur with fixedDecimalScale', async () => {
        const user = userEvent.setup();
        render(<NumberInput decimalScale={2} fixedDecimalScale />);

        await user.type(getInput(), '7.5');
        await user.tab();

        expect(getInput()).toHaveValue('7.50');
    });

    it('calls custom onBlur and onKeyDown handlers', async () => {
        const user = userEvent.setup();
        const onBlur = vi.fn();
        const onKeyDown = vi.fn();
        render(<NumberInput onBlur={onBlur} onKeyDown={onKeyDown} />);

        await user.type(getInput(), '1');
        await user.tab();

        expect(onKeyDown).toHaveBeenCalled();
        expect(onBlur).toHaveBeenCalled();
    });

    it('does not change when disabled', async () => {
        const user = userEvent.setup();
        render(<NumberInput defaultValue={3} disabled />);

        await user.type(getInput(), '9');

        expect(getInput()).toBeDisabled();
        expect(getInput()).toHaveValue('3');
        expect(screen.getByLabelText('Increment')).toBeDisabled();
    });

    it('uses the same disabled and hover states as Input', () => {
        render(<NumberInput disabled />);
        const group = getInput().parentElement;
        expect(group).toHaveClass(
            'has-[input:enabled]:hover:border-primary',
            'has-[input:disabled]:opacity-50',
            'has-[input:disabled]:cursor-not-allowed',
        );
        expect(group).not.toHaveClass('has-[input:hover]:border-primary');
    });

    it('uses the invalid border of Input', () => {
        render(<NumberInput error="Required" />);
        expect(getInput().parentElement).toHaveClass('border-destructive');
    });

    it('does not step when read-only', async () => {
        const user = userEvent.setup();
        render(<NumberInput defaultValue={3} readOnly />);

        await user.click(getInput());
        await user.keyboard('{ArrowUp}');

        expect(getInput()).toHaveValue('3');
    });
});

describe('NumberInput — forms', () => {
    it('submits the raw number through a hidden input', () => {
        const { container } = render(
            <NumberInput
                name="amount"
                defaultValue={1234.5}
                thousandSeparator=","
            />,
        );
        const hidden = container.querySelector<HTMLInputElement>(
            'input[type="hidden"]',
        );

        expect(getInput()).toHaveValue('1,234.5');
        expect(getInput()).not.toHaveAttribute('name');
        expect(hidden).toHaveAttribute('name', 'amount');
        expect(hidden).toHaveValue('1234.5');
    });

    it('submits an empty string when there is no value', () => {
        const { container } = render(<NumberInput name="amount" />);
        expect(container.querySelector('input[type="hidden"]')).toHaveValue('');
    });

    it('renders no hidden input without a name', () => {
        const { container } = render(<NumberInput />);
        expect(
            container.querySelector('input[type="hidden"]'),
        ).not.toBeInTheDocument();
    });
});
