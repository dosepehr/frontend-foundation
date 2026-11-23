import { DirectionProvider } from '@/components/ui/Direction';
import { mockChartSize } from '@/test/chartSize';
import { describeChartStates } from '@/test/chartStates';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BarChart from '.';
import type { BarChartProps } from './BarChart.types';

type Row = { month: string; desktop: number; mobile: number };

const DATA: Row[] = [
    { month: 'Jan', desktop: 186, mobile: 80 },
    { month: 'Feb', desktop: 305, mobile: 200 },
    { month: 'Mar', desktop: 237, mobile: 120 },
];
const CONFIG = {
    desktop: { label: 'Desktop' },
    mobile: { label: 'Mobile' },
};

const renderChart = (props: Partial<BarChartProps<Row>> = {}) =>
    render(
        <BarChart
            data={DATA}
            config={CONFIG}
            xKey="month"
            animate={false}
            aria-label="Visitors"
            {...props}
        />,
    );

const bars = (container: HTMLElement, key?: string) =>
    container.querySelectorAll(
        key
            ? `.recharts-bar-rectangle path[fill="var(--color-${key})"]`
            : '.recharts-bar-rectangle',
    );

const yTicks = (container: HTMLElement) =>
    [
        ...container.querySelectorAll(
            '.recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value',
        ),
    ].map((tick) => tick.textContent);

describe('BarChart', () => {
    beforeEach(() => {
        mockChartSize();
    });

    describeChartStates({
        renderChart: (state) => renderChart(state),
        renderEmpty: () => renderChart({ data: [] }),
        skeleton: 'bar',
    });

    it('draws one bar per row and series', () => {
        const { container } = renderChart();
        expect(bars(container)).toHaveLength(6);
        expect(bars(container, 'desktop')).toHaveLength(3);
        expect(
            container.querySelector('[data-chart] style')?.textContent,
        ).toContain('--color-mobile: var(--chart-2)');
    });

    it('shows an interactive legend for two series', async () => {
        const user = userEvent.setup();
        const { container } = renderChart();
        const mobile = screen.getByRole('button', { name: 'Mobile' });
        expect(mobile).toHaveAttribute('aria-pressed', 'true');

        await user.click(mobile);
        expect(mobile).toHaveAttribute('aria-pressed', 'false');
        expect(bars(container, 'mobile')).toHaveLength(0);
        expect(bars(container, 'desktop')).toHaveLength(3);
    });

    it('has no legend for one series', () => {
        renderChart({ series: ['desktop'] });
        expect(
            screen.queryByRole('button', { name: 'Desktop' }),
        ).not.toBeInTheDocument();
    });

    it('starts with hidden series', () => {
        const { container } = renderChart({ hiddenSeries: ['mobile'] });
        expect(bars(container, 'mobile')).toHaveLength(0);
    });

    it('labels values at the bar ends', () => {
        const { container } = renderChart({
            series: ['desktop'],
            showValues: true,
            valueFormatter: (value) => `${value} users`,
        });
        const labels = [
            ...container.querySelectorAll('[data-slot="bar-value"]'),
        ].map((text) => text.textContent);
        expect(labels).toEqual(['186 users', '305 users', '237 users']);
    });

    it('grays the bars the highlight leaves out', () => {
        const { container } = renderChart({
            series: ['desktop'],
            highlight: (row) => row.month === 'Feb',
        });
        const fills = [...bars(container)].map((bar) =>
            bar.querySelector('path')?.getAttribute('fill'),
        );
        expect(
            fills.filter((fill) => fill?.startsWith('color-mix')),
        ).toHaveLength(2);
    });

    it('stacks series with a surface gap', () => {
        const { container } = renderChart({ stack: 'stacked' });
        const segment = container.querySelector('.recharts-bar-rectangle path');
        expect(segment).toHaveAttribute('stroke', 'var(--chart-surface)');
    });

    it('formats percent stacks as percents', () => {
        const { container } = renderChart({ stack: 'percent' });
        const ticks = yTicks(container);
        expect(ticks).toContain('100%');
    });

    it('lays categories on the y axis for horizontal bars', () => {
        const { container } = renderChart({ orientation: 'horizontal' });
        const ticks = yTicks(container);
        expect(ticks).toEqual(['Jan', 'Feb', 'Mar']);
    });

    it('moves the value axis to the right in RTL', () => {
        const { container } = render(
            <DirectionProvider dir="rtl">
                <BarChart
                    data={DATA}
                    config={CONFIG}
                    xKey="month"
                    animate={false}
                />
            </DirectionProvider>,
        );
        const tick = container.querySelector(
            '.recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value',
        );
        expect(Number(tick?.getAttribute('x'))).toBeGreaterThan(240);
    });

    it('draws reference lines', () => {
        const { container } = renderChart({
            referenceLines: [{ value: 250, label: 'Target', tone: 'warning' }],
        });
        expect(
            container.querySelector('.recharts-reference-line line'),
        ).toHaveAttribute('stroke', 'var(--warning)');
        expect(screen.getByText('Target')).toBeInTheDocument();
    });

    it('formats axis ticks in Persian digits', () => {
        const { container } = renderChart({ locale: 'fa' });
        const ticks = yTicks(container);
        expect(ticks.some((tick) => /[۰-۹]/.test(tick ?? ''))).toBe(true);
    });

    it('renders the data as a table', () => {
        renderChart({ xLabel: 'Month', showTable: true });
        expect(screen.getByRole('table', { name: 'Visitors' })).toBeVisible();
        expect(
            screen.getByRole('columnheader', { name: 'Desktop' }),
        ).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: '305' })).toBeInTheDocument();
    });

    it('hides axes, grid and tooltip when asked', () => {
        const { container } = renderChart({
            xAxis: false,
            yAxis: false,
            grid: false,
            legend: false,
        });
        expect(
            container.querySelector('.recharts-xAxis'),
        ).not.toBeInTheDocument();
        expect(
            container.querySelector('.recharts-yAxis'),
        ).not.toBeInTheDocument();
        expect(
            container.querySelector('.recharts-cartesian-grid'),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: 'Mobile' }),
        ).not.toBeInTheDocument();
    });
});
