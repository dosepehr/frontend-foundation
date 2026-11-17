import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import MultiInput from '.';

function ControlledMultiInput(props: React.ComponentProps<typeof MultiInput>) {
    const [value, setValue] = useState<string[]>(props.value ?? []);
    return (
        <MultiInput
            {...props}
            value={value}
            onChange={(v) => {
                setValue(v);
                props.onChange?.(v);
            }}
        />
    );
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
        render(<MultiInput label="Tags" />);
        expect(screen.getByText('Tags')).toBeInTheDocument();
    });

    it('renders placeholder when provided', () => {
        render(<MultiInput placeholder="Add a tag" />);
        expect(screen.getByPlaceholderText('Add a tag')).toBeInTheDocument();
    });

    it('renders error message when provided', () => {
        render(<MultiInput error="This field is required" />);
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

    it('adds an item when a comma is typed', async () => {
        const user = userEvent.setup();
        render(<ControlledMultiInput />);

        await user.type(screen.getByRole('textbox'), 'react,vue,');

        expect(screen.getByText('react')).toBeInTheDocument();
        expect(screen.getByText('vue')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('uses custom separators', async () => {
        const user = userEvent.setup();
        render(<ControlledMultiInput separators={['Enter', ';']} />);

        await user.type(screen.getByRole('textbox'), 'a,b;');

        expect(screen.getByText('a,b')).toBeInTheDocument();
    });

    it('removes the last item on Backspace in an empty input', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <ControlledMultiInput value={['one', 'two']} onChange={onChange} />,
        );

        await user.click(screen.getByRole('textbox'));
        await user.keyboard('{Backspace}');

        expect(onChange).toHaveBeenLastCalledWith(['one']);
        expect(screen.queryByText('two')).not.toBeInTheDocument();
    });

    it('does not remove items on Backspace while typing', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<ControlledMultiInput value={['one']} onChange={onChange} />);

        await user.type(screen.getByRole('textbox'), 'ab{Backspace}');

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByRole('textbox')).toHaveValue('a');
    });

    it('splits a pasted list into items', async () => {
        const user = userEvent.setup();
        render(<ControlledMultiInput value={['a']} />);

        await user.click(screen.getByRole('textbox'));
        await user.paste('a, b, c\nd');

        for (const tag of ['a', 'b', 'c', 'd']) {
            expect(screen.getByText(tag)).toBeInTheDocument();
        }
        expect(screen.getAllByText('a')).toHaveLength(1);
    });

    it('pastes a single value as text', async () => {
        const user = userEvent.setup();
        render(<ControlledMultiInput />);

        await user.click(screen.getByRole('textbox'));
        await user.paste('single');

        expect(screen.getByRole('textbox')).toHaveValue('single');
        expect(screen.queryAllByLabelText(/Remove/)).toHaveLength(0);
    });

    it('stops adding at maxItems', async () => {
        const user = userEvent.setup();
        render(<ControlledMultiInput value={['a']} maxItems={2} />);

        await user.type(screen.getByRole('textbox'), 'b,c,');

        expect(screen.getAllByLabelText(/Remove/)).toHaveLength(2);
        expect(screen.queryByText('c')).not.toBeInTheDocument();
    });

    it('adds the typed item on blur with addOnBlur', async () => {
        const user = userEvent.setup();
        render(<ControlledMultiInput addOnBlur />);

        await user.type(screen.getByRole('textbox'), 'draft');
        await user.tab();

        expect(screen.getByText('draft')).toBeInTheDocument();
    });

    it('keeps the typed text on blur by default', async () => {
        const user = userEvent.setup();
        render(<ControlledMultiInput />);

        await user.type(screen.getByRole('textbox'), 'draft');
        await user.tab();

        expect(screen.getByRole('textbox')).toHaveValue('draft');
    });
});
