import { render } from '@testing-library/react';
import { ScrollArea, ScrollBar } from './components';

describe('ScrollArea', () => {
    it('renders data-slot="scroll-area"', () => {
        const { container } = render(
            <ScrollArea>
                <div>content</div>
            </ScrollArea>,
        );
        expect(
            container.querySelector('[data-slot="scroll-area"]'),
        ).toBeInTheDocument();
    });

    it('renders data-slot="scroll-area-viewport"', () => {
        const { container } = render(
            <ScrollArea>
                <div>content</div>
            </ScrollArea>,
        );
        expect(
            container.querySelector('[data-slot="scroll-area-viewport"]'),
        ).toBeInTheDocument();
    });

    it('renders children inside the viewport', () => {
        const { getByText } = render(
            <ScrollArea>
                <span>Scrollable content</span>
            </ScrollArea>,
        );
        expect(getByText('Scrollable content')).toBeInTheDocument();
    });

    it('renders without errors with className prop', () => {
        expect(() =>
            render(
                <ScrollArea className="custom">
                    <div />
                </ScrollArea>,
            ),
        ).not.toThrow();
    });
});

describe('ScrollBar', () => {
    it('renders with vertical orientation inside ScrollArea', () => {
        const { container } = render(
            <ScrollArea>
                <div>content</div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>,
        );
        expect(
            container.querySelector('[data-slot="scroll-area"]'),
        ).toBeInTheDocument();
    });

    it('renders with horizontal orientation inside ScrollArea', () => {
        const { container } = render(
            <ScrollArea>
                <div>content</div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>,
        );
        expect(
            container.querySelector('[data-slot="scroll-area"]'),
        ).toBeInTheDocument();
    });
});
