import { mockChartSize } from '@/test/chartSize';
import { describeChartStates } from '@/test/chartStates';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LineChart from '.';
import type { LineChartProps } from './LineChart.types';

type Row = { day: string; actual: number | null; forecast: number };

const DATA: Row[] = [
    { day: 'Mon', actual: 12, forecast: 10 },
    { day: 'Tue', actual: null, forecast: 14 },
    { day: 'Wed', actual: 18, forecast: 16 },
];
const CONFIG = {
    actual: { label: 'Actual' },
    forecast: { label: 'Forecast' },
};

const renderChart = (props: Partial<LineChartProps<Row>> = {}) =>
    render(
        <LineChart
            data={DATA}
            config={CONFIG}
            xKey="day"
            animate={false}
            {...props}
        />,
    );

const line = (container: HTMLElement, key: string) =>
    container.querySelector(
        `path.recharts-line-curve[stroke="var(--color-${key})"]`,
    );

/** Subpaths of a line: one per unbroken run of values. */
const segments = (container: HTMLElement) =>
    (line(container, 'actual')?.getAttribute('d') ?? '').split('M').length - 1;

describe('LineChart', () => {
    beforeEach(() => {
        mockChartSize();
    });

    describeChartStates({
        renderChart: (state) => renderChart(state),
        renderEmpty: () => renderChart({ data: [] }),
        skeleton: 'cartesian',
    });

    it('puts the end dot on the last value, past trailing gaps', () => {
        const { container } = renderChart({
            data: [...DATA, { day: 'Thu', actual: null, forecast: 20 }],
            series: ['actual'],
            dots: 'end',
        });
        const dots = container.querySelectorAll('[data-slot="series-end-dot"]');
        expect(dots).toHaveLength(1);
    });

    it('spaces time values by their real distance', () => {
        const day = 86_400_000;
        const { container } = render(
            <LineChart
                data={[
                    { at: 0, v: 1 },
                    { at: day, v: 2 },
                    { at: 10 * day, v: 3 },
                ]}
                config={{ v: { label: 'V' } }}
                xKey="at"
                xAxis={{ type: 'time' }}
                dots="all"
                animate={false}
            />,
        );
        const xs = [...container.querySelectorAll('.recharts-line-dot')].map(
            (dot) => Number(dot.getAttribute('cx')),
        );
        // The 9-day gap is nine times the 1-day gap.
        expect((xs[2] - xs[1]) / (xs[1] - xs[0])).toBeCloseTo(9, 0);
    });

    it('draws a 2px line per series', () => {
        const { container } = renderChart();
        expect(line(container, 'actual')).toHaveAttribute('stroke-width', '2');
        expect(line(container, 'forecast')).toBeInTheDocument();
    });

    it('dashes the dashed series only', () => {
        const { container } = renderChart({ dashedSeries: ['forecast'] });
        expect(line(container, 'forecast')).toHaveAttribute(
            'stroke-dasharray',
            '6 4',
        );
        expect(line(container, 'actual')).not.toHaveAttribute(
            'stroke-dasharray',
        );
    });

    it('marks only the last point with end dots', () => {
        const { container } = renderChart({
            dots: 'end',
            series: ['forecast'],
        });
        expect(
            container.querySelectorAll('[data-slot="series-end-dot"]'),
        ).toHaveLength(1);
    });

    it('marks every point with all dots', () => {
        const { container } = renderChart({
            dots: 'all',
            series: ['forecast'],
        });
        expect(container.querySelectorAll('.recharts-line-dot')).toHaveLength(
            3,
        );
    });

    it('breaks the line at gaps unless connectNulls', () => {
        const broken = renderChart({ series: ['actual'], curve: 'linear' });
        expect(segments(broken.container)).toBe(2);
        broken.unmount();
        const joined = renderChart({
            series: ['actual'],
            curve: 'linear',
            connectNulls: true,
        });
        expect(segments(joined.container)).toBe(1);
    });

    it('keys the legend with lines and toggles series', async () => {
        const user = userEvent.setup();
        const { container } = renderChart();
        const forecast = screen.getByRole('button', { name: 'Forecast' });
        expect(forecast.querySelector('span')).toHaveClass('h-0.5');
        await user.click(forecast);
        expect(line(container, 'forecast')).not.toBeInTheDocument();
    });

    it('formats x values on the axis and in the table', () => {
        const { container } = renderChart({
            xFormatter: (value) => `Day ${String(value)}`,
            xLabel: 'Day',
        });
        const ticks = [
            ...container.querySelectorAll(
                '.recharts-xAxis-tick-labels .recharts-cartesian-axis-tick-value',
            ),
        ].map((tick) => tick.textContent);
        expect(ticks).toContain('Day Mon');
        expect(
            screen.getByRole('rowheader', { name: 'Day Wed' }),
        ).toBeInTheDocument();
    });

    it('treats rows without numbers as empty', () => {
        render(
            <LineChart
                data={[{ day: 'Mon', actual: null, forecast: null }]}
                config={CONFIG}
                xKey="day"
            />,
        );
        expect(screen.getByText('No data yet')).toBeInTheDocument();
    });
});
