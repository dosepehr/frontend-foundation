import { render } from '@testing-library/react';
import { Separator } from './components';

describe('Separator', () => {
    it('renders with data-slot="separator"', () => {
        const { container } = render(<Separator />);
        expect(
            container.querySelector('[data-slot="separator"]'),
        ).toBeInTheDocument();
    });

    it('defaults to horizontal orientation', () => {
        const { container } = render(<Separator />);
        expect(
            container.querySelector('[data-orientation="horizontal"]'),
        ).toBeInTheDocument();
    });

    it('renders with vertical orientation', () => {
        const { container } = render(<Separator orientation="vertical" />);
        expect(
            container.querySelector('[data-orientation="vertical"]'),
        ).toBeInTheDocument();
    });

    it('forwards className', () => {
        const { container } = render(<Separator className="custom" />);
        expect(container.querySelector('[data-slot="separator"]')).toHaveClass(
            'custom',
        );
    });
});
