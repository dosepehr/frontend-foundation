import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, useWatch } from 'react-hook-form';
import z from 'zod';
import { ControlledCheckbox } from '.';

const schema = z.object({
    terms: z.boolean().refine(Boolean, 'Accept the terms to continue'),
});
type TestForm = z.infer<typeof schema>;

function TestForm({
    defaultValues = { terms: false },
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
    const termsValue = useWatch({ control, name: 'terms' });
    return (
        <form onSubmit={handleSubmit(() => {})}>
            <ControlledCheckbox
                name="terms"
                control={control}
                label="I accept the terms"
                onValueChange={onValueChange}
                error={error}
            />
            <output>{String(termsValue)}</output>
            <button type="submit">Submit</button>
        </form>
    );
}

const getCheckbox = () => screen.getByRole('checkbox');

describe('ControlledCheckbox', () => {
    it('reflects the default value', () => {
        render(<TestForm defaultValues={{ terms: true }} />);
        expect(getCheckbox()).toBeChecked();
    });

    it('treats a missing value as unchecked', () => {
        render(<TestForm defaultValues={{} as TestForm} />);
        expect(getCheckbox()).not.toBeChecked();
    });

    it('stores a boolean and calls onValueChange', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<TestForm onValueChange={onValueChange} />);

        await user.click(screen.getByText('I accept the terms'));
        expect(screen.getByRole('status')).toHaveTextContent('true');
        expect(onValueChange).toHaveBeenLastCalledWith(true);

        await user.click(getCheckbox());
        expect(screen.getByRole('status')).toHaveTextContent('false');
    });

    it('shows the schema error on submit', async () => {
        const user = userEvent.setup();
        render(<TestForm />);

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'Accept the terms to continue',
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
