import type { TreeOption } from '@/components/ui/TreeSelect/utils/tree/tree';
import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, useWatch } from 'react-hook-form';
import z from 'zod';
import { ControlledTreeSelect } from '.';

const options: TreeOption[] = [
    {
        value: 'fruit',
        label: 'Fruit',
        children: [
            { value: 'apple', label: 'Apple' },
            { value: 'banana', label: 'Banana' },
        ],
    },
    { value: 'bread', label: 'Bread' },
];

const schema = z.object({
    categories: z.array(z.string()).min(1, 'Select at least one category'),
});
type TestForm = z.infer<typeof schema>;

function TestForm({
    defaultValues = { categories: [] },
    onValueChange,
    error,
}: {
    defaultValues?: TestForm;
    onValueChange?: (values: string[]) => void;
    error?: string;
}) {
    const { control, handleSubmit } = useForm<TestForm>({
        defaultValues,
        resolver: zodResolver(schema),
    });
    const categoriesValue = useWatch({ control, name: 'categories' });
    return (
        <form onSubmit={handleSubmit(() => {})}>
            <ControlledTreeSelect
                name="categories"
                control={control}
                label="Categories"
                options={options}
                defaultExpanded="all"
                onValueChange={onValueChange}
                error={error}
            />
            <span data-testid="value">
                {(categoriesValue ?? []).join(',') || 'none'}
            </span>
            <button type="submit">Submit</button>
        </form>
    );
}

describe('ControlledTreeSelect', () => {
    it('shows the default selection', () => {
        render(<TestForm defaultValues={{ categories: ['apple'] }} />);
        expect(
            screen.getByRole('button', { name: 'Remove Apple' }),
        ).toBeVisible();
    });

    it('treats a missing value as no selection', () => {
        render(<TestForm defaultValues={{} as TestForm} />);
        expect(screen.getByTestId('value')).toHaveTextContent('none');
    });

    it('updates the form and calls onValueChange', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<TestForm onValueChange={onValueChange} />);

        await user.click(screen.getByRole('button', { expanded: false }));
        await user.click(screen.getByText('Bread'));

        expect(screen.getByTestId('value')).toHaveTextContent('bread');
        expect(onValueChange).toHaveBeenLastCalledWith(['bread']);
    });

    it('shows the schema error on submit', async () => {
        const user = userEvent.setup();
        render(<TestForm />);

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(
            await screen.findByText('Select at least one category'),
        ).toBeInTheDocument();
    });

    it('prefers the error prop', () => {
        render(<TestForm error="Pick fewer" />);
        expect(screen.getByText('Pick fewer')).toBeInTheDocument();
    });
});
