import { render } from '@testing-library/react';
import { Spinner } from './components';

describe('Spinner', () => {
    it('renders without errors', () => {
        expect(() => render(<Spinner />)).not.toThrow();
    });

    it('has role="status"', () => {
        const { getByRole } = render(<Spinner />);
        expect(getByRole('status')).toBeInTheDocument();
    });

    it('has aria-label="Loading"', () => {
        const { getByLabelText } = render(<Spinner />);
        expect(getByLabelText('Loading')).toBeInTheDocument();
    });

    it('forwards className', () => {
        const { getByRole } = render(<Spinner className="custom-spinner" />);
        expect(getByRole('status')).toHaveClass('custom-spinner');
    });

    it('accepts size prop without errors', () => {
        expect(() => render(<Spinner size="sm" />)).not.toThrow();
        expect(() => render(<Spinner size="lg" />)).not.toThrow();
    });
});
