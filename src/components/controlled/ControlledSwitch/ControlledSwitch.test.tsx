import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, useWatch } from 'react-hook-form';
import z from 'zod';
import { ControlledSwitch } from '.';

const schema = z.object({
    notifications: z
        .boolean()
        .refine(Boolean, 'Turn on notifications to continue'),
});
type TestForm = z.infer<typeof schema>;

function TestForm({
    defaultValues = { notifications: false },
    onValueChange,
    error,
}: {
    defaultValues?: TestForm;
    onValueChange?: (checked: boolean) => void;
    error?: string;
}) {
    const { control, handleSubmit } = useForm<TestForm>({
        defaultValues,
        resolver: zodResolver(schema),
    });
    const notificationsValue = useWatch({ control, name: 'notifications' });
    return (
        <form onSubmit={handleSubmit(() => {})}>
            <ControlledSwitch
                name="notifications"
                control={control}
                label="Email notifications"
                onValueChange={onValueChange}
                error={error}
            />
            <output>{String(notificationsValue)}</output>
            <button type="submit">Submit</button>
        </form>
    );
}

const getSwitch = () => screen.getByRole('switch');

describe('ControlledSwitch', () => {
    it('reflects the default value', () => {
        render(<TestForm defaultValues={{ notifications: true }} />);
        expect(getSwitch()).toBeChecked();
    });

    it('treats a missing value as unchecked', () => {
        render(<TestForm defaultValues={{} as TestForm} />);
        expect(getSwitch()).not.toBeChecked();
    });

    it('stores a boolean and calls onValueChange', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<TestForm onValueChange={onValueChange} />);

        await user.click(screen.getByText('Email notifications'));
        expect(screen.getByRole('status')).toHaveTextContent('true');
        expect(onValueChange).toHaveBeenLastCalledWith(true);

        await user.click(getSwitch());
        expect(screen.getByRole('status')).toHaveTextContent('false');
    });

    it('shows the schema error on submit', async () => {
        const user = userEvent.setup();
        render(<TestForm />);

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'Turn on notifications to continue',
        );
    });

    it('prefers the error prop', () => {
        render(<TestForm error="Required" />);
        expect(screen.getByRole('alert')).toHaveTextContent('Required');
    });

    it('shows no error while valid', () => {
        render(<TestForm />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
});
