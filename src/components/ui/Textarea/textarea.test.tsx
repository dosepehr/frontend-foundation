import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextareaWrapper from '.';
import { Textarea } from './components';

describe('Textarea', () => {
    it('renders a textarea element', () => {
        render(<Textarea />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('has data-slot="textarea"', () => {
        const { container } = render(<Textarea />);
        expect(
            container.querySelector('[data-slot="textarea"]'),
        ).toBeInTheDocument();
    });

    it('renders placeholder text', () => {
        render(<Textarea placeholder="Enter text" />);
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
        render(<Textarea disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('accepts user input', async () => {
        const user = userEvent.setup();
        render(<Textarea />);
        await user.type(screen.getByRole('textbox'), 'hello');
        expect(screen.getByRole('textbox')).toHaveValue('hello');
    });

    it('calls onChange when typed into', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<Textarea onChange={onChange} />);
        await user.type(screen.getByRole('textbox'), 'a');
        expect(onChange).toHaveBeenCalled();
    });

    it('forwards className', () => {
        const { container } = render(<Textarea className="custom-class" />);
        expect(container.querySelector('[data-slot="textarea"]')).toHaveClass(
            'custom-class',
        );
    });

    it('sets aria-invalid when prop is true', () => {
        render(<Textarea aria-invalid={true} />);
        expect(screen.getByRole('textbox')).toHaveAttribute(
            'aria-invalid',
            'true',
        );
    });
});

describe('TextareaWrapper', () => {
    it('renders a textarea', () => {
        render(<TextareaWrapper />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
        render(<TextareaWrapper label="Notes" />);
        expect(screen.getByText('Notes')).toBeInTheDocument();
    });

    it('does not render label when omitted', () => {
        render(<TextareaWrapper />);
        expect(screen.queryByText('Notes')).not.toBeInTheDocument();
    });

    it('associates label with textarea via htmlFor', () => {
        render(<TextareaWrapper label="Notes" />);
        const label = screen.getByText('Notes');
        const textarea = screen.getByRole('textbox');
        expect(label.closest('label') ?? label).toHaveAttribute(
            'for',
            textarea.id,
        );
    });

    it('renders description when provided', () => {
        render(<TextareaWrapper description="Max 500 characters" />);
        expect(screen.getByText('Max 500 characters')).toBeInTheDocument();
    });

    it('does not render description when omitted', () => {
        render(<TextareaWrapper />);
        expect(
            screen.queryByText('Max 500 characters'),
        ).not.toBeInTheDocument();
    });

    it('renders error message when provided', () => {
        render(<TextareaWrapper error="This field is required" />);
        expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('sets aria-invalid on textarea when error is provided', () => {
        render(<TextareaWrapper error="Invalid" />);
        expect(screen.getByRole('textbox')).toHaveAttribute(
            'aria-invalid',
            'true',
        );
    });

    it('does not set aria-invalid when no error', () => {
        render(<TextareaWrapper />);
        expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
    });

    it('is disabled when disabled prop is true', () => {
        render(<TextareaWrapper disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('uses provided id for textarea', () => {
        render(<TextareaWrapper id="my-textarea" label="Notes" />);
        expect(screen.getByRole('textbox')).toHaveAttribute(
            'id',
            'my-textarea',
        );
    });

    it('accepts user input', async () => {
        const user = userEvent.setup();
        render(<TextareaWrapper />);
        await user.type(screen.getByRole('textbox'), 'hello world');
        expect(screen.getByRole('textbox')).toHaveValue('hello world');
    });
});
