import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import MultiInput from '.';

function ControlledMultiInput(props: React.ComponentProps<typeof MultiInput>) {
    const [value, setValue] = useState<string[]>(props.value ?? []);
    return <MultiInput {...props} value={value} onChange={(v) => { setValue(v); props.onChange?.(v); }} />;
}

describe('MultiInput', () => {
    it('renders without errors', () => {
        expect(() => render(<MultiInput />)).not.toThrow();
    });

    it('renders an input element', () => {
        render(<MultiInput />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
        render(<MultiInput label='Tags' />);
        expect(screen.getByText('Tags')).toBeInTheDocument();
    });

    it('renders placeholder when provided', () => {
        render(<MultiInput placeholder='Add a tag' />);
        expect(screen.getByPlaceholderText('Add a tag')).toBeInTheDocument();
    });

    it('renders error message when provided', () => {
        render(<MultiInput error='This field is required' />);
        expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
        render(<MultiInput disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('renders provided initial values as badges', () => {
        render(<MultiInput value={['Item1', 'Item2']} onChange={() => {}} />);
        expect(screen.getByText('Item1')).toBeInTheDocument();
        expect(screen.getByText('Item2')).toBeInTheDocument();
    });

    it('adds an item when Enter is pressed', async () => {
        const user = userEvent.setup();
        render(<ControlledMultiInput />);
        await user.type(screen.getByRole('textbox'), 'React');
        await user.keyboard('{Enter}');
        expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('clears the input after adding an item', async () => {
        const user = userEvent.setup();
        render(<ControlledMultiInput />);
        await user.type(screen.getByRole('textbox'), 'Vue');
        await user.keyboard('{Enter}');
        expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('removes an item when its remove button is clicked', async () => {
        const user = userEvent.setup();
        render(<ControlledMultiInput value={['Angular']} />);
        await user.click(screen.getByLabelText('Remove Angular'));
        expect(screen.queryByText('Angular')).not.toBeInTheDocument();
    });

    it('calls onChange when an item is added', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<ControlledMultiInput onChange={onChange} />);
        await user.type(screen.getByRole('textbox'), 'Svelte');
        await user.keyboard('{Enter}');
        expect(onChange).toHaveBeenCalledWith(['Svelte']);
    });

    it('does not add empty items on Enter', async () => {
        const user = userEvent.setup();
        render(<ControlledMultiInput />);
        await user.click(screen.getByRole('textbox'));
        await user.keyboard('{Enter}');
        expect(screen.queryAllByLabelText(/Remove/)).toHaveLength(0);
    });

    it('does not add duplicate items', async () => {
        const user = userEvent.setup();
        render(<ControlledMultiInput value={['React']} />);
        await user.type(screen.getByRole('textbox'), 'React');
        await user.keyboard('{Enter}');
        expect(screen.getAllByText('React')).toHaveLength(1);
    });

    it('does not add an item that exceeds maxLength', async () => {
        const user = userEvent.setup();
        render(<ControlledMultiInput maxLength={3} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Hello' } });
        await user.keyboard('{Enter}');
        expect(screen.queryAllByLabelText(/Remove/)).toHaveLength(0);
    });
});
