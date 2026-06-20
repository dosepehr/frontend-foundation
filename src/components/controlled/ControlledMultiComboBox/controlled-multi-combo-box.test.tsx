import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { ControlledMultiComboBox } from '.';

const options = [
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Angular', value: 'angular' },
];

type TestForm = { frameworks: string[] };

function TestForm({
    defaultValues = { frameworks: [] },
    onValueChange,
    transformToForm,
    transformFromForm,
    error,
}: {
    defaultValues?: TestForm;
    onValueChange?: (values: string[]) => void;
    transformToForm?: (values: string[]) => unknown[];
    transformFromForm?: (values: unknown[]) => string[];
    error?: string;
}) {
    const { control } = useForm<TestForm>({ defaultValues });
    return (
        <ControlledMultiComboBox
            name='frameworks'
            control={control}
            options={options}
            onValueChange={onValueChange}
            transformToForm={transformToForm}
            transformFromForm={transformFromForm}
            error={error}
        />
    );
}

describe('ControlledMultiComboBox', () => {
    it('renders without errors', () => {
        expect(() => render(<TestForm />)).not.toThrow();
    });

    it('renders the underlying MultiComboBox trigger', () => {
        render(<TestForm />);
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('shows selected items as badges when default values are set', () => {
        render(<TestForm defaultValues={{ frameworks: ['react', 'vue'] }} />);
        expect(screen.getByLabelText('Remove React')).toBeInTheDocument();
        expect(screen.getByLabelText('Remove Vue')).toBeInTheDocument();
    });

    it('shows prop-level error', () => {
        render(<TestForm error='Select at least one framework' />);
        expect(screen.getByText('Select at least one framework')).toBeInTheDocument();
    });

    it('calls onValueChange when an option is selected', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<TestForm onValueChange={onValueChange} />);
        await user.click(screen.getByRole('combobox'));
        await user.click(screen.getByText('React'));
        expect(onValueChange).toHaveBeenCalledWith(['react']);
    });

    it('removes an item when its badge remove button is clicked', async () => {
        const user = userEvent.setup();
        render(<TestForm defaultValues={{ frameworks: ['react'] }} />);
        await user.click(screen.getByLabelText('Remove React'));
        expect(screen.queryByLabelText('Remove React')).not.toBeInTheDocument();
    });

    it('applies transformFromForm to convert form values to selected strings', () => {
        const transformFromForm = (v: unknown[]) => (v as string[]).map((s) => s.toLowerCase());
        render(
            <TestForm
                defaultValues={{ frameworks: ['REACT'] as unknown as string[] }}
                transformFromForm={transformFromForm}
            />,
        );
        expect(screen.getByLabelText('Remove React')).toBeInTheDocument();
    });

    it('applies transformToForm when calling field.onChange', async () => {
        const user = userEvent.setup();
        const transformToForm = vi.fn((v: string[]) => v.map((s) => s.toUpperCase()));
        const onValueChange = vi.fn();
        render(<TestForm transformToForm={transformToForm} onValueChange={onValueChange} />);
        await user.click(screen.getByRole('combobox'));
        await user.click(screen.getByText('Vue'));
        expect(transformToForm).toHaveBeenCalledWith(['vue']);
    });

    it('defaults selected to [] when field.value is undefined', () => {
        render(<TestForm defaultValues={{ frameworks: undefined as unknown as string[] }} />);
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
});
