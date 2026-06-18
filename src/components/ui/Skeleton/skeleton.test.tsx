import { render } from '@testing-library/react';
import { Skeleton } from './components';

describe('Skeleton', () => {
    it('renders without errors', () => {
        expect(() => render(<Skeleton />)).not.toThrow();
    });

    it('has data-slot="skeleton"', () => {
        const { container } = render(<Skeleton />);
        expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
    });

    it('forwards className', () => {
        const { container } = render(<Skeleton className='w-32 h-4' />);
        expect(container.querySelector('[data-slot="skeleton"]')).toHaveClass('w-32', 'h-4');
    });

    it('renders as a div by default', () => {
        const { container } = render(<Skeleton />);
        expect(container.querySelector('[data-slot="skeleton"]')?.tagName).toBe('DIV');
    });

    it('forwards additional props', () => {
        const { container } = render(<Skeleton data-testid='my-skeleton' />);
        expect(container.querySelector('[data-testid="my-skeleton"]')).toBeInTheDocument();
    });
});
