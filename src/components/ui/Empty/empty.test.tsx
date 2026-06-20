import { render, screen } from '@testing-library/react';
import EmptyWrapper from '.';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from './components';

describe('Empty primitives', () => {
    it('renders with data-slot="empty"', () => {
        const { container } = render(<Empty />);
        expect(
            container.querySelector('[data-slot="empty"]'),
        ).toBeInTheDocument();
    });

    it('renders EmptyTitle text', () => {
        render(
            <Empty>
                <EmptyHeader>
                    <EmptyTitle>Nothing here</EmptyTitle>
                </EmptyHeader>
            </Empty>,
        );
        expect(screen.getByText('Nothing here')).toBeInTheDocument();
    });

    it('renders EmptyDescription text', () => {
        render(
            <Empty>
                <EmptyHeader>
                    <EmptyTitle>T</EmptyTitle>
                    <EmptyDescription>Try adding some items</EmptyDescription>
                </EmptyHeader>
            </Empty>,
        );
        expect(screen.getByText('Try adding some items')).toBeInTheDocument();
    });

    it('renders EmptyContent children', () => {
        render(
            <Empty>
                <EmptyContent>
                    <button>Add item</button>
                </EmptyContent>
            </Empty>,
        );
        expect(
            screen.getByRole('button', { name: 'Add item' }),
        ).toBeInTheDocument();
    });

    it('renders EmptyMedia with data-slot="empty-icon"', () => {
        const { container } = render(
            <Empty>
                <EmptyHeader>
                    <EmptyMedia>
                        <span>icon</span>
                    </EmptyMedia>
                </EmptyHeader>
            </Empty>,
        );
        expect(
            container.querySelector('[data-slot="empty-icon"]'),
        ).toBeInTheDocument();
    });

    it('EmptyMedia reflects variant via data-variant', () => {
        const { container } = render(
            <EmptyMedia variant="icon">
                <span />
            </EmptyMedia>,
        );
        expect(
            container.querySelector('[data-slot="empty-icon"]'),
        ).toHaveAttribute('data-variant', 'icon');
    });

    it('EmptyMedia defaults to variant="default"', () => {
        const { container } = render(
            <EmptyMedia>
                <span />
            </EmptyMedia>,
        );
        expect(
            container.querySelector('[data-slot="empty-icon"]'),
        ).toHaveAttribute('data-variant', 'default');
    });

    it('forwards className to Empty', () => {
        const { container } = render(<Empty className="custom-empty" />);
        expect(container.querySelector('[data-slot="empty"]')).toHaveClass(
            'custom-empty',
        );
    });
});

describe('EmptyWrapper', () => {
    it('renders title', () => {
        render(<EmptyWrapper title="No results" />);
        expect(screen.getByText('No results')).toBeInTheDocument();
    });

    it('renders description when provided', () => {
        render(
            <EmptyWrapper
                title="No results"
                description="Try a different search"
            />,
        );
        expect(screen.getByText('Try a different search')).toBeInTheDocument();
    });

    it('does not render description when omitted', () => {
        render(<EmptyWrapper title="No results" />);
        expect(
            screen.queryByText('Try a different search'),
        ).not.toBeInTheDocument();
    });

    it('renders icon when provided', () => {
        render(
            <EmptyWrapper
                title="No results"
                icon={<span data-testid="icon" />}
            />,
        );
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('does not render EmptyMedia when icon is omitted', () => {
        const { container } = render(<EmptyWrapper title="No results" />);
        expect(
            container.querySelector('[data-slot="empty-icon"]'),
        ).not.toBeInTheDocument();
    });

    it('renders action when provided', () => {
        render(
            <EmptyWrapper title="No results" action={<button>Add</button>} />,
        );
        expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });

    it('does not render EmptyContent when action is omitted', () => {
        const { container } = render(<EmptyWrapper title="No results" />);
        expect(
            container.querySelector('[data-slot="empty-content"]'),
        ).not.toBeInTheDocument();
    });

    it('forwards className', () => {
        const { container } = render(
            <EmptyWrapper title="No results" className="custom-empty" />,
        );
        expect(container.querySelector('[data-slot="empty"]')).toHaveClass(
            'custom-empty',
        );
    });

    it.each(['icon', 'default'] as const)(
        'renders mediaVariant "%s" without errors',
        (variant) => {
            render(
                <EmptyWrapper
                    title="No results"
                    icon={<span />}
                    mediaVariant={variant}
                />,
            );
            expect(screen.getByText('No results')).toBeInTheDocument();
        },
    );
});
