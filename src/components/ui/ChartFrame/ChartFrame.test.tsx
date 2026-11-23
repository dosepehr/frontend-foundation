import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChartFrame from '.';
import type { ChartFrameProps } from './ChartFrame.types';

const table = {
    columns: [
        { key: 'month', label: 'Month' },
        {
            key: 'sales',
            label: 'Sales',
            format: (value: unknown) => `$${String(value)}`,
        },
    ],
    rows: [
        { month: 'Jan', sales: 10 },
        { month: 'Feb', sales: 20 },
    ],
};

const renderFrame = (props: Partial<ChartFrameProps> = {}) =>
    render(
        <ChartFrame isEmpty={false} height={240} label="Sales" {...props}>
            <div data-testid="plot" />
        </ChartFrame>,
    );

describe('ChartFrame', () => {
    it('renders the chart at the given height', () => {
        const { container } = renderFrame();
        expect(screen.getByTestId('plot')).toBeInTheDocument();
        expect(
            container.querySelector('[data-slot="chart-frame"] > div'),
        ).toHaveStyle({ height: '240px' });
        expect(screen.getByRole('figure', { name: 'Sales' })).toHaveAttribute(
            'data-state',
            'ready',
        );
    });

    it('shows a skeleton shaped like the chart while loading', () => {
        const { container } = renderFrame({ isLoading: true, skeleton: 'bar' });
        expect(screen.getByRole('status')).toHaveTextContent('Loading chart');
        expect(
            container.querySelector('[data-slot="chart-skeleton"]'),
        ).toHaveAttribute('data-variant', 'bar');
        expect(screen.queryByTestId('plot')).not.toBeInTheDocument();
        expect(screen.getByRole('figure')).toHaveAttribute('aria-busy', 'true');
    });

    it('shows the error state with a retry button', async () => {
        const user = userEvent.setup();
        const onRetry = vi.fn();
        renderFrame({ error: new Error('500'), onRetry });
        expect(screen.getByRole('alert')).toHaveTextContent(
            "Couldn't load the chart",
        );
        await user.click(screen.getByRole('button', { name: 'Try again' }));
        expect(onRetry).toHaveBeenCalled();
    });

    it('has no retry button without onRetry', () => {
        renderFrame({ error: true });
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('shows the empty state', () => {
        renderFrame({ isEmpty: true });
        expect(screen.getByText('No data yet')).toBeInTheDocument();
        expect(screen.queryByTestId('plot')).not.toBeInTheDocument();
    });

    it('takes custom empty and error states', () => {
        const { rerender } = renderFrame({
            isEmpty: true,
            emptyState: <p>Nothing sold</p>,
        });
        expect(screen.getByText('Nothing sold')).toBeInTheDocument();
        rerender(
            <ChartFrame
                isEmpty={false}
                height={240}
                error
                errorState={<p>Broken</p>}
            >
                <div />
            </ChartFrame>,
        );
        expect(screen.getByText('Broken')).toBeInTheDocument();
    });

    it('dims the chart while refetching', () => {
        const { container } = renderFrame({ isFetching: true });
        expect(screen.getByTestId('plot')).toBeInTheDocument();
        expect(
            container.querySelector('[data-slot="chart-frame"] > div'),
        ).toHaveClass('opacity-60');
    });

    it('uses Persian copy and label overrides', () => {
        const { rerender } = renderFrame({ isEmpty: true, locale: 'fa' });
        expect(screen.getByText('داده‌ای وجود ندارد')).toBeInTheDocument();
        rerender(
            <ChartFrame
                isEmpty
                height={240}
                labels={{ emptyTitle: 'Empty month' }}
            >
                <div />
            </ChartFrame>,
        );
        expect(screen.getByText('Empty month')).toBeInTheDocument();
    });

    it('renders the data as a screen-reader table', () => {
        renderFrame({ table });
        const element = screen.getByRole('table', { name: 'Sales' });
        expect(element).toHaveClass('sr-only');
        expect(
            screen.getByRole('rowheader', { name: 'Feb' }),
        ).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: '$20' })).toBeInTheDocument();
    });

    it('shows the table with showTable', () => {
        renderFrame({ table, showTable: true });
        expect(screen.getByRole('table')).not.toHaveClass('sr-only');
    });

    it('hides the table outside the ready state', () => {
        renderFrame({ table, isEmpty: true });
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
});
