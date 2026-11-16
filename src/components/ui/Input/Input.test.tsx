import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '.';
import {
    InputComponent,
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from './components';

describe('InputComponent', () => {
    it('renders an input element', () => {
        render(<InputComponent />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('has data-slot="input"', () => {
        const { container } = render(<InputComponent />);
        expect(
            container.querySelector('[data-slot="input"]'),
        ).toBeInTheDocument();
    });

    it('defaults to type="text"', () => {
        render(<InputComponent />);
        expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('respects a custom type', () => {
        const { container } = render(<InputComponent type="email" />);
        expect(container.querySelector('input')).toHaveAttribute(
            'type',
            'email',
        );
    });

    it('renders placeholder text', () => {
        render(<InputComponent placeholder="Enter value" />);
        expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
        render(<InputComponent disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('accepts user input', async () => {
        const user = userEvent.setup();
        render(<InputComponent />);
        await user.type(screen.getByRole('textbox'), 'hello');
        expect(screen.getByRole('textbox')).toHaveValue('hello');
    });

    it('calls onChange when typed into', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<InputComponent onChange={onChange} />);
        await user.type(screen.getByRole('textbox'), 'a');
        expect(onChange).toHaveBeenCalled();
    });

    it('forwards className', () => {
        const { container } = render(
            <InputComponent className="custom-input" />,
        );
        expect(container.querySelector('[data-slot="input"]')).toHaveClass(
            'custom-input',
        );
    });
});

describe('Input', () => {
    it('renders an input', () => {
        render(<Input />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
        render(<Input label="Full name" />);
        expect(screen.getByText('Full name')).toBeInTheDocument();
    });

    it('does not render label when omitted', () => {
        render(<Input />);
        expect(screen.queryByText('Full name')).not.toBeInTheDocument();
    });

    it('associates label with input via htmlFor', () => {
        render(<Input label="Email" />);
        const label = screen.getByText('Email');
        const input = screen.getByRole('textbox');
        expect(label.closest('label') ?? label).toHaveAttribute(
            'for',
            input.id,
        );
    });

    it('renders description when provided', () => {
        render(<Input description="Enter your full name" />);
        expect(screen.getByText('Enter your full name')).toBeInTheDocument();
    });

    it('does not render description when omitted', () => {
        render(<Input />);
        expect(
            screen.queryByText('Enter your full name'),
        ).not.toBeInTheDocument();
    });

    it('renders error message when provided', () => {
        render(<Input error="This field is required" />);
        expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('sets aria-invalid on input when error is provided', () => {
        render(<Input error="Invalid" />);
        expect(screen.getByRole('textbox')).toHaveAttribute(
            'aria-invalid',
            'true',
        );
    });

    it('does not set aria-invalid when no error', () => {
        render(<Input />);
        expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
    });

    it('renders startAddon when provided', () => {
        render(<Input startAddon={<span data-testid="start">@</span>} />);
        expect(screen.getByTestId('start')).toBeInTheDocument();
    });

    it('renders endAddon when provided', () => {
        render(<Input endAddon={<span data-testid="end">.com</span>} />);
        expect(screen.getByTestId('end')).toBeInTheDocument();
    });

    it('renders action when provided', () => {
        render(<Input action={<button>Search</button>} />);
        expect(
            screen.getByRole('button', { name: 'Search' }),
        ).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
        render(<Input disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('accepts user input', async () => {
        const user = userEvent.setup();
        render(<Input />);
        await user.type(screen.getByRole('textbox'), 'world');
        expect(screen.getByRole('textbox')).toHaveValue('world');
    });

    it('uses provided id for input', () => {
        render(<Input id="my-input" label="Name" />);
        expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-input');
    });
});

describe('InputGroup', () => {
    it('renders without errors', () => {
        expect(() =>
            render(
                <InputGroup>
                    <input />
                </InputGroup>,
            ),
        ).not.toThrow();
    });

    it('has data-slot="input-group"', () => {
        const { container } = render(
            <InputGroup>
                <input />
            </InputGroup>,
        );
        expect(
            container.querySelector('[data-slot="input-group"]'),
        ).toBeInTheDocument();
    });
});

describe('InputGroupInput', () => {
    it('renders an input', () => {
        render(
            <InputGroup>
                <InputGroupInput />
            </InputGroup>,
        );
        expect(
            document.querySelector('[data-slot="input"]'),
        ).toBeInTheDocument();
    });
});

describe('InputGroupAddon', () => {
    it('has data-slot="input-group-addon"', () => {
        const { container } = render(
            <InputGroup>
                <InputGroupAddon>$</InputGroupAddon>
            </InputGroup>,
        );
        expect(
            container.querySelector('[data-slot="input-group-addon"]'),
        ).toBeInTheDocument();
    });

    it('applies inline-end alignment', () => {
        const { container } = render(
            <InputGroup>
                <InputGroupAddon align="inline-end">.com</InputGroupAddon>
            </InputGroup>,
        );
        expect(
            container.querySelector('[data-align="inline-end"]'),
        ).toBeInTheDocument();
    });
});

describe('InputGroupText', () => {
    it('has data-slot="input-group-text"', () => {
        const { container } = render(
            <InputGroup>
                <InputGroupText>kg</InputGroupText>
            </InputGroup>,
        );
        expect(
            container.querySelector('[data-slot="input-group-text"]'),
        ).toBeInTheDocument();
    });
});
