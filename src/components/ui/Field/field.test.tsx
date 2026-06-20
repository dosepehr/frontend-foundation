import { render, screen } from '@testing-library/react';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from './components';

describe('Field', () => {
    it('has data-slot="field"', () => {
        const { container } = render(<Field />);
        expect(
            container.querySelector('[data-slot="field"]'),
        ).toBeInTheDocument();
    });

    it('renders with role="group"', () => {
        render(<Field />);
        expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('forwards className', () => {
        const { container } = render(<Field className="custom" />);
        expect(container.querySelector('[data-slot="field"]')).toHaveClass(
            'custom',
        );
    });
});

describe('FieldSet', () => {
    it('has data-slot="field-set"', () => {
        const { container } = render(<FieldSet />);
        expect(
            container.querySelector('[data-slot="field-set"]'),
        ).toBeInTheDocument();
    });

    it('renders as a fieldset element', () => {
        const { container } = render(<FieldSet />);
        expect(container.querySelector('fieldset')).toBeInTheDocument();
    });

    it('renders children', () => {
        render(
            <FieldSet>
                <span>child</span>
            </FieldSet>,
        );
        expect(screen.getByText('child')).toBeInTheDocument();
    });
});

describe('FieldLegend', () => {
    it('has data-slot="field-legend"', () => {
        const { container } = render(
            <FieldSet>
                <FieldLegend>Legend</FieldLegend>
            </FieldSet>,
        );
        expect(
            container.querySelector('[data-slot="field-legend"]'),
        ).toBeInTheDocument();
    });

    it('renders legend text', () => {
        render(
            <FieldSet>
                <FieldLegend>My legend</FieldLegend>
            </FieldSet>,
        );
        expect(screen.getByText('My legend')).toBeInTheDocument();
    });

    it('accepts variant="label"', () => {
        const { container } = render(
            <FieldSet>
                <FieldLegend variant="label">Label legend</FieldLegend>
            </FieldSet>,
        );
        expect(
            container.querySelector('[data-variant="label"]'),
        ).toBeInTheDocument();
    });
});

describe('FieldGroup', () => {
    it('has data-slot="field-group"', () => {
        const { container } = render(<FieldGroup />);
        expect(
            container.querySelector('[data-slot="field-group"]'),
        ).toBeInTheDocument();
    });

    it('renders children', () => {
        render(
            <FieldGroup>
                <span>group child</span>
            </FieldGroup>,
        );
        expect(screen.getByText('group child')).toBeInTheDocument();
    });
});

describe('FieldContent', () => {
    it('has data-slot="field-content"', () => {
        const { container } = render(<FieldContent />);
        expect(
            container.querySelector('[data-slot="field-content"]'),
        ).toBeInTheDocument();
    });

    it('renders children', () => {
        render(
            <FieldContent>
                <span>content</span>
            </FieldContent>,
        );
        expect(screen.getByText('content')).toBeInTheDocument();
    });
});

describe('FieldTitle', () => {
    it('has data-slot="field-label"', () => {
        const { container } = render(<FieldTitle>Title</FieldTitle>);
        expect(
            container.querySelector('[data-slot="field-label"]'),
        ).toBeInTheDocument();
    });

    it('renders text', () => {
        render(<FieldTitle>My title</FieldTitle>);
        expect(screen.getByText('My title')).toBeInTheDocument();
    });
});

describe('FieldDescription', () => {
    it('has data-slot="field-description"', () => {
        const { container } = render(<FieldDescription>Desc</FieldDescription>);
        expect(
            container.querySelector('[data-slot="field-description"]'),
        ).toBeInTheDocument();
    });

    it('renders text', () => {
        render(<FieldDescription>Description text</FieldDescription>);
        expect(screen.getByText('Description text')).toBeInTheDocument();
    });
});

describe('FieldSeparator', () => {
    it('has data-slot="field-separator"', () => {
        const { container } = render(<FieldSeparator />);
        expect(
            container.querySelector('[data-slot="field-separator"]'),
        ).toBeInTheDocument();
    });

    it('renders children text when provided', () => {
        render(<FieldSeparator>or</FieldSeparator>);
        expect(screen.getByText('or')).toBeInTheDocument();
    });

    it('renders without children', () => {
        expect(() => render(<FieldSeparator />)).not.toThrow();
    });
});

describe('FieldLabel', () => {
    it('has data-slot="field-label"', () => {
        const { container } = render(<FieldLabel>Label</FieldLabel>);
        expect(
            container.querySelector('[data-slot="field-label"]'),
        ).toBeInTheDocument();
    });

    it('renders children', () => {
        render(<FieldLabel>My label</FieldLabel>);
        expect(screen.getByText('My label')).toBeInTheDocument();
    });
});

describe('FieldError', () => {
    it('returns null when no children and no errors', () => {
        const { container } = render(<FieldError />);
        expect(
            container.querySelector('[data-slot="field-error"]'),
        ).not.toBeInTheDocument();
    });

    it('renders with role="alert" when children provided', () => {
        render(<FieldError>Error message</FieldError>);
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('renders single error from errors array', () => {
        render(<FieldError errors={[{ message: 'Required field' }]} />);
        expect(screen.getByText('Required field')).toBeInTheDocument();
    });

    it('renders multiple unique errors as a list', () => {
        render(
            <FieldError
                errors={[
                    { message: 'Too short' },
                    { message: 'Must include number' },
                ]}
            />,
        );
        expect(screen.getByText('Too short')).toBeInTheDocument();
        expect(screen.getByText('Must include number')).toBeInTheDocument();
    });

    it('deduplicates errors with the same message', () => {
        render(
            <FieldError
                errors={[{ message: 'Required' }, { message: 'Required' }]}
            />,
        );
        expect(screen.getAllByText('Required')).toHaveLength(1);
    });

    it('returns null when errors array is empty', () => {
        const { container } = render(<FieldError errors={[]} />);
        expect(
            container.querySelector('[data-slot="field-error"]'),
        ).not.toBeInTheDocument();
    });

    it('skips list items where error message is falsy', () => {
        render(<FieldError errors={[{ message: 'Real error' }, undefined]} />);
        expect(screen.getByText('Real error')).toBeInTheDocument();
    });
});
