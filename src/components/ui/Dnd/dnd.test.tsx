import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dnd from '.';
import type { DndFile, DndRejection } from './dnd.types';

function makeFile(name: string, size: number, type: string) {
    const file = new File(['a'.repeat(size)], name, { type });
    return file;
}

describe('Dnd', () => {
    it('renders the label, description and dropzone', () => {
        render(<Dnd label="Upload file" description="Up to 5MB" />);

        expect(screen.getByText('Upload file')).toBeInTheDocument();
        expect(screen.getByText('Up to 5MB')).toBeInTheDocument();
        expect(
            screen.getByText('Drag & drop your file here'),
        ).toBeInTheDocument();
    });

    it('renders the error message', () => {
        render(<Dnd label="Upload file" error="File is required" />);
        expect(screen.getByRole('alert')).toHaveTextContent('File is required');
    });

    it('shows accepted formats and max size in the footer', () => {
        render(<Dnd accept={{ 'image/*': ['.png', '.jpg'] }} maxSizeMB={10} />);

        expect(screen.getByText(/PNG, JPG/)).toBeInTheDocument();
        expect(screen.getByText(/Max size: 10MB/)).toBeInTheDocument();
    });

    it('adds a file selected through the hidden input', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const { container } = render(<Dnd onChange={onChange} />);

        const input = container.querySelector(
            '[data-slot="dnd-input"]',
        ) as HTMLInputElement;
        const file = makeFile('resume.pdf', 100, 'application/pdf');

        await user.upload(input, file);

        expect(onChange).toHaveBeenCalledTimes(1);
        const [files] = onChange.mock.calls[0] as [DndFile[]];
        expect(files).toHaveLength(1);
        expect(files[0].name).toBe('resume.pdf');
        expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    });

    it('hides the dropzone after a file is picked in single mode', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const { container } = render(<Dnd onChange={onChange} />);
        const input = container.querySelector(
            '[data-slot="dnd-input"]',
        ) as HTMLInputElement;

        await user.upload(input, makeFile('a.png', 10, 'image/png'));

        expect(
            screen.queryByText('Drag & drop your file here'),
        ).not.toBeInTheDocument();
        expect(screen.getByText('a.png')).toBeInTheDocument();
    });

    it('allows picking a new file after removing the current one in single mode', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const file: DndFile = { id: '1', name: 'a.png', size: 10 };
        const { rerender } = render(<Dnd value={[file]} onChange={onChange} />);

        await user.click(
            screen.getByRole('button', { name: /remove a\.png/i }),
        );
        rerender(<Dnd value={[]} onChange={onChange} />);

        expect(
            screen.getByText('Drag & drop your file here'),
        ).toBeInTheDocument();
    });

    it('accumulates files in multiple mode', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const { container, rerender } = render(
            <Dnd onChange={onChange} multiple maxFiles={5} />,
        );
        const input = container.querySelector(
            '[data-slot="dnd-input"]',
        ) as HTMLInputElement;

        await user.upload(input, makeFile('a.png', 10, 'image/png'));
        const [firstFiles] = onChange.mock.calls[0] as [DndFile[]];
        rerender(
            <Dnd
                onChange={onChange}
                multiple
                maxFiles={5}
                value={firstFiles}
            />,
        );

        await user.upload(input, makeFile('b.png', 10, 'image/png'));
        const [secondFiles] = onChange.mock.calls[1] as [DndFile[]];

        expect(secondFiles.map((f) => f.name)).toEqual(['a.png', 'b.png']);
    });

    it('rejects files exceeding maxSizeMB', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const onRejected = vi.fn();
        const { container } = render(
            <Dnd
                onChange={onChange}
                onRejected={onRejected}
                maxSizeMB={0.01}
            />,
        );
        const input = container.querySelector(
            '[data-slot="dnd-input"]',
        ) as HTMLInputElement;

        await user.upload(input, makeFile('big.png', 20_000, 'image/png'));

        expect(onChange).not.toHaveBeenCalled();
        expect(onRejected).toHaveBeenCalledTimes(1);
        const [rejections] = onRejected.mock.calls[0] as [DndRejection[]];
        expect(rejections[0].reason).toBe('size');
    });

    it('rejects dropped files with a disallowed type', () => {
        const onChange = vi.fn();
        const onRejected = vi.fn();
        const { container } = render(
            <Dnd
                onChange={onChange}
                onRejected={onRejected}
                accept={{ 'image/*': ['.png'] }}
            />,
        );
        const zone = container.querySelector(
            '[data-slot="dnd-zone"]',
        ) as HTMLElement;
        const file = makeFile('doc.pdf', 10, 'application/pdf');

        fireEvent.drop(zone, { dataTransfer: { files: [file] } });

        expect(onChange).not.toHaveBeenCalled();
        expect(onRejected).toHaveBeenCalledTimes(1);
        const [rejections] = onRejected.mock.calls[0] as [DndRejection[]];
        expect(rejections[0].reason).toBe('type');
    });

    it('does not open the file picker or accept drops when disabled', () => {
        const onChange = vi.fn();
        const { container } = render(<Dnd onChange={onChange} disabled />);
        const zone = container.querySelector(
            '[data-slot="dnd-zone"]',
        ) as HTMLElement;

        expect(zone).toHaveAttribute('data-disabled', 'true');

        fireEvent.drop(zone, {
            dataTransfer: { files: [makeFile('a.png', 10, 'image/png')] },
        });

        expect(onChange).not.toHaveBeenCalled();
    });

    it('adds a file via native drag and drop', () => {
        const onChange = vi.fn();
        const { container } = render(<Dnd onChange={onChange} />);
        const zone = container.querySelector(
            '[data-slot="dnd-zone"]',
        ) as HTMLElement;
        const file = makeFile('dropped.png', 10, 'image/png');

        fireEvent.drop(zone, { dataTransfer: { files: [file] } });

        expect(onChange).toHaveBeenCalledTimes(1);
        const [files] = onChange.mock.calls[0] as [DndFile[]];
        expect(files[0].name).toBe('dropped.png');
    });

    it('sets data-dragging while a drag is over the zone', () => {
        const { container } = render(<Dnd />);
        const zone = container.querySelector(
            '[data-slot="dnd-zone"]',
        ) as HTMLElement;

        fireEvent.dragEnter(zone);
        expect(zone).toHaveAttribute('data-dragging', 'true');

        fireEvent.dragLeave(zone);
        expect(zone).not.toHaveAttribute('data-dragging');
    });

    it('removes a file when the remove action is clicked (no confirmation)', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const onRemoveSpy = vi.fn();
        const file: DndFile = { id: '1', name: 'resume.pdf', size: 100 };

        render(
            <Dnd value={[file]} onChange={onChange} onRemove={onRemoveSpy} />,
        );

        await user.click(
            screen.getByRole('button', { name: /remove resume\.pdf/i }),
        );

        expect(onRemoveSpy).toHaveBeenCalledWith(file);
        expect(onChange).toHaveBeenCalledWith([]);
    });

    it('asks for confirmation before removing when confirmRemove is set', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const file: DndFile = { id: '1', name: 'resume.pdf', size: 100 };

        render(
            <Dnd
                value={[file]}
                onChange={onChange}
                confirmRemove
                confirmRemoveTitle="Remove file?"
            />,
        );

        await user.click(
            screen.getByRole('button', { name: /remove resume\.pdf/i }),
        );

        expect(onChange).not.toHaveBeenCalled();
        const dialog = await screen.findByRole('alertdialog');
        expect(within(dialog).getByText('Remove file?')).toBeInTheDocument();

        await user.click(
            within(dialog).getByRole('button', { name: 'Remove' }),
        );

        expect(onChange).toHaveBeenCalledWith([]);
    });

    it('cancelling the confirmation keeps the file', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const file: DndFile = { id: '1', name: 'resume.pdf', size: 100 };

        render(<Dnd value={[file]} onChange={onChange} confirmRemove />);

        await user.click(
            screen.getByRole('button', { name: /remove resume\.pdf/i }),
        );
        const dialog = await screen.findByRole('alertdialog');
        await user.click(
            within(dialog).getByRole('button', { name: 'Cancel' }),
        );

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    });

    it('hides the dropzone once maxFiles is reached in multiple mode', () => {
        const onChange = vi.fn();
        const { rerender } = render(
            <Dnd onChange={onChange} multiple maxFiles={1} />,
        );

        expect(
            screen.getByText('Drag & drop your file here'),
        ).toBeInTheDocument();

        const file: DndFile = { id: '1', name: 'a.png', size: 10 };
        rerender(
            <Dnd onChange={onChange} multiple maxFiles={1} value={[file]} />,
        );

        expect(
            screen.queryByText('Drag & drop your file here'),
        ).not.toBeInTheDocument();
    });

    it('renders custom placeholder content', () => {
        render(<Dnd placeholder={<span>Custom placeholder</span>} />);
        expect(screen.getByText('Custom placeholder')).toBeInTheDocument();
    });
});
