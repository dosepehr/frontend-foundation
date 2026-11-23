import { mockChartSize } from '@/test/chartSize';
import { describeChartStates } from '@/test/chartStates';
import { render, screen } from '@testing-library/react';
import AreaChart from '.';
import type { AreaChartProps } from './AreaChart.types';

type Row = { month: string; organic: number; paid: number };

const DATA: Row[] = [
    { month: 'Jan', organic: 40, paid: 24 },
    { month: 'Feb', organic: 30, paid: 13 },
    { month: 'Mar', organic: 20, paid: 38 },
];
const CONFIG = { organic: { label: 'Organic' }, paid: { label: 'Paid' } };

const renderChart = (props: Partial<AreaChartProps<Row>> = {}) =>
    render(
        <AreaChart
            data={DATA}
            config={CONFIG}
            xKey="month"
            animate={false}
            {...props}
        />,
    );

const area = (container: HTMLElement, key: string) =>
    container.querySelector(
        `path.recharts-area-area[stroke="none"][fill*="${key}"]`,
    ) ?? container.querySelector(`.recharts-area-area[fill*="${key}"]`);

describe('AreaChart', () => {
    beforeEach(() => {
        mockChartSize();
    });

    describeChartStates({
        renderChart: (state) => renderChart(state),
        renderEmpty: () => renderChart({ data: [] }),
        skeleton: 'cartesian',
    });

    it('fills each series with a 10% wash', () => {
        const { container } = renderChart();
        expect(area(container, 'organic')).toHaveAttribute(
            'fill-opacity',
            '0.1',
        );
        expect(area(container, 'paid')).toHaveAttribute(
            'fill',
            'var(--color-paid)',
        );
    });

    it('fills with gradients', () => {
        const { container } = renderChart({ fill: 'gradient' });
        expect(container.querySelectorAll('linearGradient')).toHaveLength(2);
        expect(area(container, 'organic')?.getAttribute('fill')).toMatch(
            /^url\(#.+-organic\)$/,
        );
    });

    it('stacks to 100% with percent ticks', () => {
        const { container } = renderChart({ stack: 'percent' });
        const ticks = [
            ...container.querySelectorAll(
                '.recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value',
            ),
        ].map((tick) => tick.textContent);
        expect(ticks).toContain('100%');
    });

    it('keys the legend with squares', () => {
        renderChart();
        expect(
            screen.getByRole('button', { name: 'Paid' }).querySelector('span'),
        ).toHaveClass('size-2');
    });
});
