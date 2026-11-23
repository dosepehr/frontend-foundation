// The loading, refetching, error and empty states every chart shares,
// checked the same way for each. Call inside the chart's describe so its
// beforeEach (mockChartSize) applies.
import type {
    ChartSkeletonVariant,
    ChartStateProps,
} from '@/components/ui/ChartFrame/ChartFrame.types';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type ChartStatesOptions = {
    /** Renders the chart with its data plus these state props. */
    renderChart: (state: ChartStateProps) => { container: HTMLElement };
    /** Renders the chart without data. */
    renderEmpty: () => void;
    skeleton: ChartSkeletonVariant;
};

export function describeChartStates({
    renderChart,
    renderEmpty,
    skeleton,
}: ChartStatesOptions) {
    describe('states', () => {
        it('shows a skeleton shaped like the chart while loading', () => {
            const { container } = renderChart({ isLoading: true });
            expect(screen.getByRole('status')).toHaveTextContent(
                'Loading chart',
            );
            expect(
                container.querySelector('[data-slot="chart-skeleton"]'),
            ).toHaveAttribute('data-variant', skeleton);
            expect(
                container.querySelector('.recharts-surface'),
            ).not.toBeInTheDocument();
        });

        it('keeps the chart, dimmed, while refetching', () => {
            const { container } = renderChart({ isFetching: true });
            expect(
                container.querySelector('.recharts-surface'),
            ).toBeInTheDocument();
            expect(
                container.querySelector('[data-slot="chart-frame"] > div'),
            ).toHaveClass('opacity-60');
            expect(screen.getByRole('figure')).toHaveAttribute(
                'aria-busy',
                'true',
            );
        });

        it('shows the error state with a retry button', async () => {
            const user = userEvent.setup();
            const onRetry = vi.fn();
            const { container } = renderChart({
                error: new Error('500'),
                onRetry,
            });
            expect(screen.getByRole('alert')).toHaveTextContent(
                "Couldn't load the chart",
            );
            expect(
                container.querySelector('.recharts-surface'),
            ).not.toBeInTheDocument();
            await user.click(screen.getByRole('button', { name: 'Try again' }));
            expect(onRetry).toHaveBeenCalled();
        });

        it('shows the empty state without data', () => {
            renderEmpty();
            expect(screen.getByText('No data yet')).toBeInTheDocument();
        });

        it('takes custom states and Persian copy', () => {
            const { container } = renderChart({ error: true, locale: 'fa' });
            expect(screen.getByRole('alert')).toHaveTextContent(
                'بارگذاری نمودار ناموفق بود',
            );
            container.remove();
            renderChart({ error: true, errorState: <p>Broken feed</p> });
            expect(screen.getByText('Broken feed')).toBeInTheDocument();
        });
    });
}
