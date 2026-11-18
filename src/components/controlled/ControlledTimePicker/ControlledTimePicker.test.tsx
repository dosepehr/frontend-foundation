import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, useWatch } from 'react-hook-form';
import z from 'zod';
import { ControlledTimePicker } from '.';

const schema = z.object({
    start: z
        .string()
        .optional()
        .refine((value) => !!value, 'Select the start time'),
});
type TestForm = z.infer<typeof schema>;

function TestForm({
    defaultValues = {},
    onValueChange,
    error,
}: {
    defaultValues?: TestForm;
    onValueChange?: (value: string | undefined) => void;
    error?: string;
}) {
    const { control, handleSubmit } = useForm<TestForm>({
        defaultValues,
        resolver: zodResolver(schema),
    });
    const startValue = useWatch({ control, name: 'start' });
    return (
        <form onSubmit={handleSubmit(() => {})}>
            <ControlledTimePicker
                name="start"
                control={control}
                label="Start"
                onValueChange={onValueChange}
                error={error}
            />
            <output>{startValue ?? 'none'}</output>
            <button type="submit">Submit</button>
        </form>
    );
}

const trigger = () => screen.getByRole('button', { name: 'Start' });

describe('ControlledTimePicker', () => {
    it('shows the placeholder while empty', () => {
        render(<TestForm />);
        expect(trigger()).toHaveTextContent('Pick a time');
    });

    it('shows the default value', () => {
        render(<TestForm defaultValues={{ start: '14:05' }} />);
        expect(trigger()).toHaveTextContent('14:05');
    });

    it('updates the form and calls onValueChange', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(
            <TestForm
                defaultValues={{ start: '14:05' }}
                onValueChange={onValueChange}
            />,
        );

        await user.click(trigger());
        const hours = screen.getByRole('listbox', { name: 'Hours' });
        await user.click(within(hours).getByRole('option', { name: '09' }));

        expect(screen.getByRole('status')).toHaveTextContent('09:05');
        expect(onValueChange).toHaveBeenLastCalledWith('09:05');
    });

    it('shows the schema error on submit', async () => {
        const user = userEvent.setup();
        render(<TestForm />);

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(
            await screen.findByText('Select the start time'),
        ).toBeInTheDocument();
    });

    it('prefers the error prop', () => {
        render(<TestForm error="Outside opening hours" />);
        expect(screen.getByText('Outside opening hours')).toBeInTheDocument();
    });
});
