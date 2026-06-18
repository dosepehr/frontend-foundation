import { render } from '@testing-library/react';
import { Progress } from './components';

describe('Progress', () => {
    it('renders without errors', () => {
        expect(() => render(<Progress value={50} />)).not.toThrow();
    });

    it('has data-slot="progress"', () => {
        const { container } = render(<Progress value={50} />);
        expect(container.querySelector('[data-slot="progress"]')).toBeInTheDocument();
    });

    it('has data-slot="progress-indicator"', () => {
        const { container } = render(<Progress value={50} />);
        expect(container.querySelector('[data-slot="progress-indicator"]')).toBeInTheDocument();
    });

    it('renders with value 0', () => {
        const { container } = render(<Progress value={0} />);
        expect(container.querySelector('[data-slot="progress"]')).toBeInTheDocument();
    });

    it('renders with value 100', () => {
        const { container } = render(<Progress value={100} />);
        expect(container.querySelector('[data-slot="progress"]')).toBeInTheDocument();
    });

    it('forwards className', () => {
        const { container } = render(<Progress value={50} className='custom-progress' />);
        expect(container.querySelector('[data-slot="progress"]')).toHaveClass('custom-progress');
    });

    it('renders with no value prop', () => {
        expect(() => render(<Progress />)).not.toThrow();
    });
});
