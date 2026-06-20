import { render, screen } from '@testing-library/react';
import { Label } from './components';

describe('Label', () => {
    it('renders children', () => {
        render(<Label>My label</Label>);
        expect(screen.getByText('My label')).toBeInTheDocument();
    });

    it('has data-slot="label"', () => {
        const { container } = render(<Label>Label</Label>);
        expect(container.querySelector('[data-slot="label"]')).toBeInTheDocument();
    });

    it('renders asterisk when required is true', () => {
        render(<Label required>Required field</Label>);
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('does not render asterisk when required is false', () => {
        render(<Label>Optional field</Label>);
        expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('applies disabled styling when disabled is true', () => {
        const { container } = render(<Label disabled>Disabled</Label>);
        expect(container.querySelector('[data-slot="label"]')).toHaveClass('opacity-50');
    });

    it('forwards htmlFor to the label element', () => {
        render(<Label htmlFor='my-input'>Input label</Label>);
        expect(screen.getByText('Input label').closest('label')).toHaveAttribute('for', 'my-input');
    });
});
