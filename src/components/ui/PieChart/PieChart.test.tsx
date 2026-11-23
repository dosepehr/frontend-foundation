import { mockChartSize } from '@/test/chartSize';
import { describeChartStates } from '@/test/chartStates';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PieChart from '.';
import type { PieChartProps } from './PieChart.types';

type Row = { browser: string; visitors: number };

const DATA: Row[] = [
    { browser: 'chrome', visitors: 275 },
    { browser: 'safari', visitors: 200 },
    { browser: 'firefox', visitors: 187 },
    { browser: 'edge', visitors: 173 },
    { browser: 'opera', visitors: 90 },
    { browser: 'brave', visitors: 45 },
    { browser: 'arc', visitors: 30 },
];
const CONFIG = {
    chrome: { label: 'Chrome' },
    safari: { label: 'Safari' },
    firefox: { label: 'Firefox' },
    edge: { label: 'Edge' },
    opera: { label: 'Opera' },
    brave: { label: 'Brave' },
    arc: { label: 'Arc' },
};

const renderChart = (props: Partial<PieChartProps<Row>> = {}) =>
    render(
        <PieChart
            data={DATA}
            config={CONFIG}
            nameKey="browser"
            valueKey="visitors"
            animate={false}
            aria-label="Browsers"
            {...props}
        />,
    );

const sectors = (container: HTMLElement) =>
    [...container.querySelectorAll('.recharts-pie-sector path')].map((path) =>
        path.getAttribute('fill'),
    );

describe('PieChart', () => {
    beforeEach(() => {
        mockChartSize();
    });

    describeChartStates({
        renderChart: (state) => renderChart(state),
        renderEmpty: () => renderChart({ data: [] }),
        skeleton: 'pie',
    });

    it('reports the clicked slice', () => {
        const onSliceClick = vi.fn();
        const { container } = renderChart({ onSliceClick });
        fireEvent.click(
            container.querySelectorAll('.recharts-pie-sector path')[1],
        );
        expect(onSliceClick).toHaveBeenCalledWith(DATA[1], 1);
    });

    it('folds the smallest slices into a gray Other', () => {
        const { container } = renderChart();
        const fills = sectors(container);
        expect(fills).toHaveLength(6);
        expect(fills.at(-1)).toBe('var(--muted-foreground)');
        expect(
            screen.getByRole('button', { name: 'Other' }),
        ).toBeInTheDocument();
    });

    it('keeps every slice without folding room to spare', () => {
        const { container } = renderChart({ maxSlices: 10 });
        expect(sectors(container)).toHaveLength(7);
    });

    it('separates slices with a surface gap', () => {
        const { container } = renderChart();
        expect(
            container.querySelector('.recharts-pie-sector path'),
        ).toHaveAttribute('stroke', 'var(--chart-surface)');
    });

    it('shows the total in the middle of the donut', () => {
        const { container } = renderChart({
            centerLabel: { label: 'Visitors' },
        });
        const center = container.querySelector(
            '[data-slot="chart-center-label"]',
        );
        expect(center).toHaveTextContent('1,000');
        expect(center).toHaveTextContent('Visitors');
    });

    it('draws a full pie without a center label', () => {
        const { container } = renderChart({ donut: false });
        expect(
            container.querySelector('[data-slot="chart-center-label"]'),
        ).not.toBeInTheDocument();
    });

    it('hides a slice from the legend and keeps the others colors', async () => {
        const user = userEvent.setup();
        const { container } = renderChart();
        await user.click(screen.getByRole('button', { name: 'Chrome' }));
        const fills = sectors(container);
        expect(fills).toHaveLength(5);
        expect(fills[0]).toBe('var(--color-safari)');
        expect(screen.getByRole('button', { name: 'Chrome' })).toHaveAttribute(
            'aria-pressed',
            'false',
        );
        expect(
            container.querySelector('[data-slot="chart-center-label"]'),
        ).toHaveTextContent('725');
    });

    it('labels slices with their share', () => {
        const { container } = renderChart({ showLabels: true, maxSlices: 2 });
        const labels = [
            ...container.querySelectorAll('[data-slot="slice-label"]'),
        ].map((label) => label.textContent);
        expect(labels).toEqual(['27.5%', '72.5%']);
    });

    it('lists name, value and share in the table', () => {
        renderChart({ nameLabel: 'Browser', valueLabel: 'Visitors' });
        expect(
            screen.getByRole('rowheader', { name: 'Chrome' }),
        ).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: '27.5%' })).toBeInTheDocument();
        expect(
            screen.getByRole('rowheader', { name: 'Other' }),
        ).toBeInTheDocument();
    });

    it('uses Persian digits and the Persian Other', () => {
        const { container } = renderChart({ locale: 'fa' });
        expect(
            container.querySelector('[data-slot="chart-center-label"]'),
        ).toHaveTextContent('۱٬۰۰۰');
        expect(
            screen.getByRole('button', { name: 'سایر' }),
        ).toBeInTheDocument();
    });

    it('is empty when every value is zero', () => {
        render(
            <PieChart
                data={[{ browser: 'chrome', visitors: 0 }]}
                config={CONFIG}
                nameKey="browser"
                valueKey="visitors"
            />,
        );
        expect(screen.getByText('No data yet')).toBeInTheDocument();
    });
});
