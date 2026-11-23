import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { seriesDot } from './seriesDot';

type DotFn = (props: {
    cx?: number;
    cy?: number;
    index?: number;
}) => ReactElement;

describe('seriesDot', () => {
    it('draws no dots', () => {
        expect(seriesDot('none', 'red', 3)).toBe(false);
    });

    it('rings every dot with the surface', () => {
        expect(seriesDot('all', 'red', 3)).toEqual({
            r: 4,
            fill: 'red',
            stroke: 'var(--chart-surface)',
            strokeWidth: 2,
        });
    });

    it('draws only the last dot', () => {
        const dot = seriesDot('end', 'red', 2) as DotFn;
        const { container, rerender } = render(
            <svg>{dot({ cx: 10, cy: 20, index: 2 })}</svg>,
        );
        expect(container.querySelector('circle')).toHaveAttribute('r', '4');
        rerender(<svg>{dot({ cx: 10, cy: 20, index: 1 })}</svg>);
        expect(container.querySelector('circle')).not.toBeInTheDocument();
    });
});
