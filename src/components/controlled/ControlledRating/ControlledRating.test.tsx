import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, useWatch } from 'react-hook-form';
import z from 'zod';
import { ControlledRating } from '.';

const schema = z.object({ score: z.number().min(1, 'Rate your stay') });
type TestForm = z.infer<typeof schema>;

function TestForm({
    defaultValues = { score: 0 },
    onValueChange,
    error,
}: {
    defaultValues?: TestForm;
    onValueChange?: (value: number) => void;
    error?: string;
}) {
    const { control, handleSubmit } = useForm<TestForm>({
        defaultValues,
        resolver: zodResolver(schema),
    });
    const scoreValue = useWatch({ control, name: 'score' });
    return (
        <form onSubmit={handleSubmit(() => {})}>
            <ControlledRating
                name="score"
                control={control}
                label="Score"
                onValueChange={onValueChange}
                error={error}
            />
            <output>{scoreValue}</output>
            <button type="submit">Submit</button>
        </form>
    );
}

const stars = (container: HTMLElement) =>
    container.querySelectorAll('[data-slot="rating"] > span');

describe('ControlledRating', () => {
    it('reflects the default value', () => {
        render(<TestForm defaultValues={{ score: 4 }} />);
        expect(screen.getByRole('slider', { name: 'Score' })).toHaveAttribute(
            'aria-valuenow',
            '4',
        );
    });

    it('treats a missing value as 0', () => {
        render(<TestForm defaultValues={{} as TestForm} />);
        expect(screen.getByRole('slider')).toHaveAttribute(
            'aria-valuenow',
            '0',
        );
    });

    it('updates the form and calls onValueChange', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        const { container } = render(
            <TestForm onValueChange={onValueChange} />,
        );

        await user.click(stars(container)[2]);

        expect(screen.getByRole('status')).toHaveTextContent('3');
        expect(onValueChange).toHaveBeenCalledWith(3);
    });

    it('submits the value under the field name', () => {
        const { container } = render(<TestForm defaultValues={{ score: 2 }} />);
        expect(container.querySelector('input[name="score"]')).toHaveValue('2');
    });

    it('shows the schema error on submit', async () => {
        const user = userEvent.setup();
        render(<TestForm />);

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(await screen.findByText('Rate your stay')).toBeInTheDocument();
    });

    it('prefers the error prop', () => {
        render(<TestForm error="Too low" />);
        expect(screen.getByText('Too low')).toBeInTheDocument();
    });
});
