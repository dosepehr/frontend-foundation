import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { ControlledMultiInput } from '.';

type TestForm = { tags: string[] };

function TestForm({
    defaultValues = { tags: [] },
    onValueChange,
    error,
}: {
    defaultValues?: TestForm;
    onValueChange?: (values: string[]) => void;
    error?: string;
}) {
    const { control } = useForm<TestForm>({ defaultValues });
    return (
        <ControlledMultiInput
            name="tags"
            control={control}
            onValueChange={onValueChange}
            error={error}
            placeholder="Add tag"
        />
    );
}

describe('ControlledMultiInput', () => {
    it('renders without errors', () => {
        expect(() => render(<TestForm />)).not.toThrow();
    });

    it('renders the underlying MultiInput', () => {
        render(<TestForm />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('reflects default values from the form as badges', () => {
        render(<TestForm defaultValues={{ tags: ['React', 'Vue'] }} />);
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Vue')).toBeInTheDocument();
    });

    it('shows prop-level error', () => {
        render(<TestForm error="At least one tag required" />);
        expect(
            screen.getByText('At least one tag required'),
        ).toBeInTheDocument();
    });

    it('calls onValueChange when a tag is added', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<TestForm onValueChange={onValueChange} />);
        await user.type(screen.getByRole('textbox'), 'TypeScript');
        await user.keyboard('{Enter}');
        expect(onValueChange).toHaveBeenCalledWith(['TypeScript']);
    });

    it('adds a tag to the form state on Enter', async () => {
        const user = userEvent.setup();
        render(<TestForm />);
        await user.type(screen.getByRole('textbox'), 'Angular');
        await user.keyboard('{Enter}');
        expect(screen.getByText('Angular')).toBeInTheDocument();
    });

    it('calls onValueChange when a tag is removed', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(
            <TestForm
                defaultValues={{ tags: ['React'] }}
                onValueChange={onValueChange}
            />,
        );
        await user.click(screen.getByLabelText('Remove React'));
        expect(onValueChange).toHaveBeenCalledWith([]);
    });

    it('defaults value to [] when field.value is undefined', () => {
        render(
            <TestForm
                defaultValues={{ tags: undefined as unknown as string[] }}
            />,
        );
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
});
