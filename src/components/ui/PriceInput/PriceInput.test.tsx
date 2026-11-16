import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PriceInput from '.';

const getInput = () => screen.getByRole<HTMLInputElement>('spinbutton');

describe('PriceInput', () => {
    it('groups thousands with a comma by default', async () => {
        const user = userEvent.setup();
        render(<PriceInput />);

        await user.type(getInput(), '1250000');

        expect(getInput()).toHaveValue('1,250,000');
    });

    it('uses a custom thousand separator', async () => {
        const user = userEvent.setup();
        render(<PriceInput thousandSeparator=" " />);

        await user.type(getInput(), '1250000');

        expect(getInput()).toHaveValue('1 250 000');
    });

    it('allows two decimals by default', async () => {
        const user = userEvent.setup();
        render(<PriceInput />);

        await user.type(getInput(), '19.999');

        expect(getInput()).toHaveValue('19.99');
    });

    it('allows whole amounts only with decimalScale 0', async () => {
        const user = userEvent.setup();
        render(<PriceInput decimalScale={0} />);

        await user.type(getInput(), '19.5');

        expect(getInput()).toHaveValue('195');
        expect(getInput()).toHaveAttribute('inputmode', 'numeric');
    });

    it('rejects negative amounts by default', async () => {
        const user = userEvent.setup();
        render(<PriceInput />);

        await user.type(getInput(), '-10');

        expect(getInput()).toHaveValue('10');
    });

    it('allows negatives when min is negative', async () => {
        const user = userEvent.setup();
        render(<PriceInput min={-100} />);

        await user.type(getInput(), '-10');

        expect(getInput()).toHaveValue('-10');
    });

    it('reports the raw number', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<PriceInput onValueChange={onValueChange} />);

        await user.type(getInput(), '1500.5');

        expect(onValueChange).toHaveBeenLastCalledWith(1500.5);
    });

    it('hides the stepper by default and shows it on request', () => {
        const { rerender } = render(<PriceInput />);
        expect(screen.queryByLabelText('Increment')).not.toBeInTheDocument();

        rerender(<PriceInput showStepper />);
        expect(screen.getByLabelText('Increment')).toBeInTheDocument();
    });

    it('shows the currency at the start by default', () => {
        render(<PriceInput currency="$" startAddon="ignored" />);
        expect(screen.getByText('$')).toBeInTheDocument();
        expect(screen.queryByText('ignored')).not.toBeInTheDocument();
    });

    it('shows the currency at the end', () => {
        render(
            <PriceInput currency="EUR" currencyPosition="end" startAddon="#" />,
        );
        expect(screen.getByText('EUR')).toBeInTheDocument();
        expect(screen.getByText('#')).toBeInTheDocument();
    });

    it('keeps both addons when there is no currency', () => {
        render(<PriceInput startAddon="from" endAddon="per month" />);
        expect(screen.getByText('from')).toBeInTheDocument();
        expect(screen.getByText('per month')).toBeInTheDocument();
    });

    it('does not highlight on hover when disabled', () => {
        render(<PriceInput currency="$" disabled />);
        const group = getInput().parentElement;
        expect(getInput()).toBeDisabled();
        expect(group).toHaveClass('has-[input:enabled]:hover:border-primary');
        expect(group).not.toHaveClass('has-[input:hover]:border-primary');
        expect(group).toHaveClass('has-[input:disabled]:opacity-50');
    });

    it('writes the amount in Persian words under the input by default', async () => {
        const user = userEvent.setup();
        render(<PriceInput wordsUnit="تومان" decimalScale={0} />);

        await user.type(getInput(), '۱۰۰۰');

        expect(getInput()).toHaveValue('1,000');
        expect(screen.getByText('هزار تومان')).toHaveAttribute(
            'data-slot',
            'input-hint',
        );
    });

    it('updates the words while typing', async () => {
        const user = userEvent.setup();
        render(<PriceInput wordsUnit="تومان" />);

        await user.type(getInput(), '1');
        expect(screen.getByText('یک تومان')).toBeInTheDocument();

        await user.type(getInput(), '500');
        expect(screen.getByText('هزار و پانصد تومان')).toBeInTheDocument();
    });

    it('writes the amount in English words', () => {
        render(
            <PriceInput defaultValue={2500} words="en" wordsUnit="dollars" />,
        );
        expect(
            screen.getByText('two thousand five hundred dollars'),
        ).toBeInTheDocument();
    });

    it('writes the words without a unit', () => {
        render(<PriceInput defaultValue={1000} />);
        expect(screen.getByText('هزار')).toBeInTheDocument();
    });

    it('keeps an empty words line while empty so the layout does not shift', async () => {
        const user = userEvent.setup();
        const { container } = render(<PriceInput wordsUnit="تومان" />);
        const line = container.querySelector('[data-slot="input-hint"]');
        expect(line).toBeEmptyDOMElement();
        expect(line).toHaveClass('min-h-lh');

        await user.type(getInput(), '1000');
        expect(container.querySelector('[data-slot="input-hint"]')).toBe(line);
        expect(line).toHaveTextContent('هزار تومان');

        await user.clear(getInput());
        expect(line).toBeEmptyDOMElement();
    });

    it('reserves no words line with words={false} and no hint', () => {
        const { container } = render(<PriceInput words={false} />);
        expect(
            container.querySelector('[data-slot="input-hint"]'),
        ).not.toBeInTheDocument();
    });

    it('follows a controlled value', () => {
        const { rerender } = render(<PriceInput value={1000} />);
        expect(screen.getByText('هزار')).toBeInTheDocument();

        rerender(<PriceInput value={2000} />);
        expect(screen.getByText('دو هزار')).toBeInTheDocument();
    });

    it('hides the words and shows the hint with words={false}', () => {
        render(
            <PriceInput
                defaultValue={1000}
                words={false}
                hint="Excluding tax"
            />,
        );
        expect(screen.queryByText('هزار')).not.toBeInTheDocument();
        expect(screen.getByText('Excluding tax')).toBeInTheDocument();
    });

    it('formats a default value', () => {
        render(<PriceInput defaultValue={9876543.21} />);
        expect(getInput()).toHaveValue('9,876,543.21');
    });

    it('renders the label and error from Input', () => {
        render(<PriceInput label="Price" error="Price is required" required />);
        expect(screen.getByLabelText(/Price/)).toBe(getInput());
        expect(screen.getByText('Price is required')).toBeInTheDocument();
    });
});
