import { render, screen } from '@testing-library/react';
import { DirectionProvider, useDirection } from '.';

function DirectionProbe() {
    return <span>{useDirection()}</span>;
}

describe('Direction', () => {
    it('defaults to ltr without a provider', () => {
        render(<DirectionProbe />);
        expect(screen.getByText('ltr')).toBeInTheDocument();
    });

    it('exposes the direction set by DirectionProvider', () => {
        render(
            <DirectionProvider dir="rtl">
                <DirectionProbe />
            </DirectionProvider>,
        );
        expect(screen.getByText('rtl')).toBeInTheDocument();
    });
});
