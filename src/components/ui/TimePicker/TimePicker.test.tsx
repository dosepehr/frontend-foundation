import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import TimePicker from '.';
import type { TimePickerProps } from './TimePicker.types';

function Controlled(props: TimePickerProps) {
    const [value, setValue] = useState(props.value);
    return (
        <>
            <TimePicker {...props} value={value} onChange={setValue} />
            <output>{value ?? 'empty'}</output>
        </>
    );
}

const openPicker = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(screen.getByRole('button', { expanded: false }));
};

describe('TimePicker — trigger', () => {
    it('shows the placeholder while empty', () => {
        render(<TimePicker />);
        expect(screen.getByRole('button')).toHaveTextContent('Pick a time');
    });

    it('shows the value on a 24-hour clock', () => {
        render(<TimePicker value="14:05" />);
        expect(screen.getByRole('button')).toHaveTextContent('14:05');
    });

    it('shows the value on a 12-hour clock', () => {
        render(<TimePicker value="14:05" hourCycle={12} />);
        expect(screen.getByRole('button')).toHaveTextContent('2:05 PM');
    });

    it('renders the label, description and error', () => {
        render(
            <TimePicker
                label="Start"
                description="Local time"
                error="Required"
            />,
        );
        expect(screen.getByLabelText('Start')).toBe(screen.getByRole('button'));
        expect(screen.getByText('Local time')).toBeInTheDocument();
        expect(screen.getByText('Required')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveAttribute(
            'aria-invalid',
            'true',
        );
    });

    it('can be disabled', () => {
        render(<TimePicker disabled />);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('uses a custom start addon', () => {
        render(<TimePicker startAddon={<span>at</span>} />);
        expect(screen.getByText('at')).toBeInTheDocument();
    });
});

describe('TimePicker — popover', () => {
    it('opens hour and minute columns', async () => {
        const user = userEvent.setup();
        render(<TimePicker />);

        await openPicker(user);

        expect(
            screen.getByRole('listbox', { name: 'Hours' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('listbox', { name: 'Minutes' }),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('listbox', { name: 'Seconds' }),
        ).not.toBeInTheDocument();
    });

    it('picks hours and minutes', async () => {
        const user = userEvent.setup();
        render(<Controlled />);
        await openPicker(user);

        const hours = screen.getByRole('listbox', { name: 'Hours' });
        const minutes = screen.getByRole('listbox', { name: 'Minutes' });
        await user.click(within(hours).getByRole('option', { name: '09' }));
        await user.click(within(minutes).getByRole('option', { name: '45' }));

        expect(screen.getByRole('status')).toHaveTextContent('09:45');
        expect(
            within(hours).getByRole('option', { name: '09' }),
        ).toHaveAttribute('aria-selected', 'true');
    });

    it('shows seconds and minute steps', async () => {
        const user = userEvent.setup();
        render(<Controlled showSeconds minuteStep={15} value="10:15:00" />);
        await openPicker(user);

        const minutes = screen.getByRole('listbox', { name: 'Minutes' });
        expect(within(minutes).getAllByRole('option')).toHaveLength(4);

        const seconds = screen.getByRole('listbox', { name: 'Seconds' });
        await user.click(within(seconds).getByRole('option', { name: '30' }));
        expect(screen.getByRole('status')).toHaveTextContent('10:15:30');
    });

    it('picks AM/PM on a 12-hour clock', async () => {
        const user = userEvent.setup();
        render(<Controlled hourCycle={12} value="09:00" />);
        await openPicker(user);

        const period = screen.getByRole('listbox', { name: 'AM/PM' });
        await user.click(within(period).getByRole('option', { name: 'PM' }));

        expect(screen.getByRole('status')).toHaveTextContent('21:00');
    });

    it('moves focus within a column with the arrow keys', async () => {
        const user = userEvent.setup();
        render(<TimePicker value="05:00" />);
        await openPicker(user);

        const hours = screen.getByRole('listbox', { name: 'Hours' });
        within(hours).getByRole('option', { name: '05' }).focus();
        await user.keyboard('{ArrowDown}');

        expect(within(hours).getByRole('option', { name: '06' })).toHaveFocus();
    });

    it('clears the value and closes', async () => {
        const user = userEvent.setup();
        render(<Controlled value="08:00" />);
        await openPicker(user);

        await user.click(screen.getByRole('button', { name: 'Clear' }));

        expect(screen.getByRole('status')).toHaveTextContent('empty');
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('hides the clear button while empty or when not clearable', async () => {
        const user = userEvent.setup();
        const { rerender } = render(<TimePicker />);
        await openPicker(user);
        expect(
            screen.queryByRole('button', { name: 'Clear' }),
        ).not.toBeInTheDocument();

        rerender(<TimePicker value="08:00" clearable={false} />);
        expect(
            screen.queryByRole('button', { name: 'Clear' }),
        ).not.toBeInTheDocument();
    });

    it('can be opened from outside', () => {
        const onOpenChange = vi.fn();
        render(<TimePicker open onOpenChange={onOpenChange} />);
        expect(
            screen.getByRole('listbox', { name: 'Hours' }),
        ).toBeInTheDocument();
    });
});
