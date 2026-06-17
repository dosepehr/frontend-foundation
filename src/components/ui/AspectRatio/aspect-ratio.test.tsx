import { render, screen } from '@testing-library/react';
import { AspectRatio } from './index';

describe('AspectRatio', () => {
    it('renders children', () => {
        render(
            <AspectRatio ratio={16 / 9}>
                <img src='image.jpg' alt='test' />
            </AspectRatio>,
        );
        expect(screen.getByAltText('test')).toBeInTheDocument();
    });

    it('renders with data-slot attribute', () => {
        const { container } = render(
            <AspectRatio ratio={16 / 9}>
                <div>content</div>
            </AspectRatio>,
        );
        expect(container.querySelector('[data-slot="aspect-ratio"]')).toBeInTheDocument();
    });

    it('accepts a ratio prop without errors', () => {
        // Radix computes the ratio via CSS in a real browser; happy-dom does not
        // compute styles, so we just verify the component renders with no throw.
        expect(() =>
            render(
                <AspectRatio ratio={4 / 3}>
                    <div>content</div>
                </AspectRatio>,
            ),
        ).not.toThrow();
    });

    it('forwards className', () => {
        const { container } = render(
            <AspectRatio ratio={1} className='custom-class'>
                <div>content</div>
            </AspectRatio>,
        );
        expect(container.querySelector('[data-slot="aspect-ratio"]')).toHaveClass('custom-class');
    });
});
