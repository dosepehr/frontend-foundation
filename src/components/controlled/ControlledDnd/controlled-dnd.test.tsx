import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ControlledDnd } from '.';
import type { DndFile } from '../../ui/Dnd/dnd.types';

type TestForm = { attachments: DndFile[] };

function makeFile(name: string, type = 'image/png') {
    return new File(['content'], name, { type });
}

function TestFormHarness({
    defaultValues = { attachments: [] },
    onFilesChange,
    error,
    multiple = true,
}: {
    defaultValues?: TestForm;
    onFilesChange?: (files: DndFile[]) => void;
    error?: string;
    multiple?: boolean;
}) {
    const { control } = useForm<TestForm>({ defaultValues });
    return (
        <ControlledDnd
            name="attachments"
            control={control}
            multiple={multiple}
            onFilesChange={onFilesChange}
            error={error}
        />
    );
}

describe('ControlledDnd', () => {
    it('renders without errors', () => {
        expect(() => render(<TestFormHarness />)).not.toThrow();
    });

    it('renders existing files from the form default value', () => {
        render(
            <TestFormHarness
                defaultValues={{
                    attachments: [{ id: '1', name: 'existing.png', size: 100 }],
                }}
            />,
        );
        expect(screen.getByText('existing.png')).toBeInTheDocument();
    });

    it('shows prop-level error when the field is empty', () => {
        render(<TestFormHarness error="At least one file is required" />);
        expect(
            screen.getByText('At least one file is required'),
        ).toBeInTheDocument();
    });

    it('calls onFilesChange when a file is added', async () => {
        const user = userEvent.setup();
        const onFilesChange = vi.fn();
        const { container } = render(
            <TestFormHarness onFilesChange={onFilesChange} />,
        );
        const input = container.querySelector(
            '[data-slot="dnd-input"]',
        ) as HTMLInputElement;

        await user.upload(input, makeFile('photo.png'));

        expect(onFilesChange).toHaveBeenCalledTimes(1);
        const [files] = onFilesChange.mock.calls[0] as [DndFile[]];
        expect(files[0].name).toBe('photo.png');
    });

    it('removes a file and reports the updated list', async () => {
        const user = userEvent.setup();
        const onFilesChange = vi.fn();
        render(
            <TestFormHarness
                defaultValues={{
                    attachments: [{ id: '1', name: 'existing.png', size: 100 }],
                }}
                onFilesChange={onFilesChange}
            />,
        );

        await user.click(
            screen.getByRole('button', { name: /remove existing\.png/i }),
        );

        expect(onFilesChange).toHaveBeenCalledWith([]);
    });
});

describe('ControlledDnd with zod validation', () => {
    const schema = z.object({
        attachments: z
            .array(z.object({ id: z.string(), name: z.string() }))
            .min(1, { message: 'Please upload at least one file.' }),
    });
    type FormValues = z.infer<typeof schema>;

    function ZodForm({ onSubmit }: { onSubmit: (values: FormValues) => void }) {
        const { control, handleSubmit } = useForm<FormValues>({
            resolver: zodResolver(schema),
            defaultValues: { attachments: [] },
        });

        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <ControlledDnd name="attachments" control={control} multiple />
                <button type="submit">Submit</button>
            </form>
        );
    }

    it('surfaces the zod error when submitting without a file', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        render(<ZodForm onSubmit={onSubmit} />);

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(
            await screen.findByText('Please upload at least one file.'),
        ).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('submits successfully once a file is added', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const { container } = render(<ZodForm onSubmit={onSubmit} />);
        const input = container.querySelector(
            '[data-slot="dnd-input"]',
        ) as HTMLInputElement;

        await user.upload(input, makeFile('photo.png'));
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(onSubmit).toHaveBeenCalledTimes(1);
        const [values] = onSubmit.mock.calls[0] as [FormValues];
        expect(values.attachments[0].name).toBe('photo.png');
    });
});
