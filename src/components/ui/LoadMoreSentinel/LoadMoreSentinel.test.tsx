import { render, screen } from '@testing-library/react';
import LoadMoreSentinel from '.';

describe('LoadMoreSentinel', () => {
    it('renders nothing without a next page', () => {
        const { container } = render(<LoadMoreSentinel />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders an empty sentinel while there is a next page', () => {
        const { container } = render(<LoadMoreSentinel hasNextPage />);
        const sentinel = container.querySelector(
            '[data-slot="load-more-sentinel"]',
        );
        expect(sentinel).toBeEmptyDOMElement();
    });

    it('shows a spinner and text while fetching', () => {
        render(<LoadMoreSentinel isFetchingNextPage loadingText="Loading" />);
        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('fetches when it scrolls into view', () => {
        let notify:
            | ((entries: { isIntersecting: boolean }[]) => void)
            | undefined;
        vi.stubGlobal(
            'IntersectionObserver',
            class {
                constructor(callback: NonNullable<typeof notify>) {
                    notify = callback;
                }
                observe = vi.fn();
                disconnect = vi.fn();
            },
        );
        const onFetchNextPage = vi.fn();
        render(
            <LoadMoreSentinel hasNextPage onFetchNextPage={onFetchNextPage} />,
        );

        notify?.([{ isIntersecting: true }]);

        expect(onFetchNextPage).toHaveBeenCalled();
        vi.unstubAllGlobals();
    });
});
