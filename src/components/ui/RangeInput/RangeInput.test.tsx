import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import RangeInput from '.';
import type { RangeInputProps, RangeValue } from './RangeInput.types';

const getFrom = () =>
    screen.getByRole<HTMLInputElement>('spinbutton', { name: 'Minimum' });
const getTo = () =>
    screen.getByRole<HTMLInputElement>('spinbutton', { name: 'Maximum' });

function Controlled(props: RangeInputProps) {
    const [value, setValue] = useState<RangeValue>(props.value ?? [null, null]);
    return (
        <>
            <RangeInput {...props} value={value} onValueChange={setValue} />
            <output>{JSON.stringify(value)}</output>
        </>
    );
}

describe('RangeInput — rendering', () => {
    it('renders two number inputs with placeholders', () => {
        render(<RangeInput />);
        expect(getFrom()).toHaveAttribute('placeholder', 'Min');
        expect(getTo()).toHaveAttribute('placeholder', 'Max');
    });

    it('uses custom labels and placeholders', () => {
        render(
            <RangeInput
                fromLabel="From price"
                toLabel="To price"
                fromPlaceholder="From"
                toPlaceholder="To"
            />,
        );
        expect(
            screen.getByRole('spinbutton', { name: 'From price' }),
        ).toHaveAttribute('placeholder', 'From');
        expect(
            screen.getByRole('spinbutton', { name: 'To price' }),
        ).toBeInTheDocument();
    });

    it('links the field label to the first input', () => {
        render(<RangeInput label="Price" />);
        expect(screen.getByText('Price').closest('label')).toHaveAttribute(
            'for',
            getFrom().id,
        );
    });

    it('shows the error once and marks both inputs invalid', () => {
        render(<RangeInput error="Pick a range" />);
        expect(screen.getAllByText('Pick a range')).toHaveLength(1);
        expect(getFrom()).toHaveAttribute('aria-invalid', 'true');
        expect(getTo()).toHaveAttribute('aria-invalid', 'true');
    });

    it('shows addons in both inputs', () => {
        render(<RangeInput startAddon="$" />);
        expect(screen.getAllByText('$')).toHaveLength(2);
    });

    it('renders the slider only with min and max', () => {
        const { rerender } = render(<RangeInput showSlider />);
        expect(screen.queryByRole('slider')).not.toBeInTheDocument();

        rerender(<RangeInput showSlider min={0} max={100} />);
        expect(screen.getAllByRole('slider')).toHaveLength(2);
    });

    it('disables both inputs and the slider', () => {
        render(<RangeInput disabled showSlider min={0} max={10} />);
        expect(getFrom()).toBeDisabled();
        expect(getTo()).toBeDisabled();
        expect(screen.getAllByRole('slider')[0]).toHaveAttribute(
            'data-disabled',
        );
    });
});

describe('RangeInput — values', () => {
    it('shows the default value', () => {
        render(<RangeInput defaultValue={[10, 20]} />);
        expect(getFrom()).toHaveValue('10');
        expect(getTo()).toHaveValue('20');
    });

    it('reports both ends while typing (uncontrolled)', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<RangeInput onValueChange={onValueChange} />);

        await user.type(getFrom(), '5');
        expect(onValueChange).toHaveBeenLastCalledWith([5, null]);

        await user.type(getTo(), '9');
        expect(onValueChange).toHaveBeenLastCalledWith([5, 9]);
    });

    it('works as a controlled input', async () => {
        const user = userEvent.setup();
        render(<Controlled value={[1, 2]} />);

        await user.clear(getTo());
        await user.type(getTo(), '50');

        expect(screen.getByRole('status')).toHaveTextContent('[1,50]');
    });

    it('keeps "from" at or below "to" on blur', async () => {
        const user = userEvent.setup();
        render(<Controlled value={[null, 10]} />);

        await user.type(getFrom(), '25');
        await user.tab();

        expect(getFrom()).toHaveValue('10');
        expect(screen.getByRole('status')).toHaveTextContent('[10,10]');
    });

    it('keeps "to" at or above "from" on blur', async () => {
        const user = userEvent.setup();
        render(<Controlled value={[30, null]} />);

        await user.type(getTo(), '5');
        await user.tab();

        expect(getTo()).toHaveValue('30');
    });

    it('clamps both ends to min and max', async () => {
        const user = userEvent.setup();
        render(<Controlled min={0} max={100} />);

        await user.type(getTo(), '500');
        await user.tab();

        expect(getTo()).toHaveValue('100');
    });

    it('groups thousands', () => {
        render(
            <RangeInput defaultValue={[1000, 250000]} thousandSeparator="," />,
        );
        expect(getFrom()).toHaveValue('1,000');
        expect(getTo()).toHaveValue('250,000');
    });
});

describe('RangeInput — slider', () => {
    it('places open ends at min and max', () => {
        render(<RangeInput showSlider min={0} max={100} />);
        const [fromThumb, toThumb] = screen.getAllByRole('slider');
        expect(fromThumb).toHaveAttribute('aria-valuenow', '0');
        expect(toThumb).toHaveAttribute('aria-valuenow', '100');
    });

    it('moves a thumb and updates the inputs', () => {
        render(
            <Controlled
                showSlider
                min={0}
                max={100}
                step={10}
                value={[20, 80]}
            />,
        );
        const [fromThumb] = screen.getAllByRole('slider');

        fireEvent.keyDown(fromThumb, { key: 'ArrowRight' });

        expect(getFrom()).toHaveValue('30');
        expect(screen.getByRole('status')).toHaveTextContent('[30,80]');
    });

    it('follows typed values', async () => {
        const user = userEvent.setup();
        render(<Controlled showSlider min={0} max={100} />);

        await user.type(getFrom(), '40');

        expect(screen.getAllByRole('slider')[0]).toHaveAttribute(
            'aria-valuenow',
            '40',
        );
    });

    it('labels the thumbs like the inputs', () => {
        render(<RangeInput showSlider min={0} max={10} />);
        const [fromThumb, toThumb] = screen.getAllByRole('slider');
        expect(fromThumb).toHaveAttribute('aria-label', 'Minimum');
        expect(toThumb).toHaveAttribute('aria-label', 'Maximum');
    });
});
