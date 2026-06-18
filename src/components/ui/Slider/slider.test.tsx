import { render } from '@testing-library/react';
import { Slider } from './components';

describe('Slider', () => {
    it('renders without errors', () => {
        expect(() => render(<Slider defaultValue={[50]} />)).not.toThrow();
    });

    it('has data-slot="slider"', () => {
        const { container } = render(<Slider defaultValue={[50]} />);
        expect(container.querySelector('[data-slot="slider"]')).toBeInTheDocument();
    });

    it('renders a single thumb for a single-value array', () => {
        const { container } = render(<Slider defaultValue={[50]} />);
        expect(container.querySelectorAll('[data-slot="slider-thumb"]')).toHaveLength(1);
    });

    it('renders two thumbs for a range (two-value array)', () => {
        const { container } = render(<Slider defaultValue={[20, 80]} />);
        expect(container.querySelectorAll('[data-slot="slider-thumb"]')).toHaveLength(2);
    });

    it('is disabled when disabled prop is true', () => {
        const { container } = render(<Slider defaultValue={[50]} disabled />);
        expect(container.querySelector('[data-slot="slider"]')).toHaveAttribute('data-disabled');
    });

    it('forwards className', () => {
        const { container } = render(<Slider defaultValue={[50]} className='custom-slider' />);
        expect(container.querySelector('[data-slot="slider"]')).toHaveClass('custom-slider');
    });

    it('renders with min and max props', () => {
        expect(() => render(<Slider defaultValue={[5]} min={0} max={10} />)).not.toThrow();
    });

    it('renders with step prop', () => {
        expect(() => render(<Slider defaultValue={[0]} min={0} max={100} step={10} />)).not.toThrow();
    });
});
