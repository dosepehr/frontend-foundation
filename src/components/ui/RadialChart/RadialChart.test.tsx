import { mockChartSize } from '@/test/chartSize';
import { describeChartStates } from '@/test/chartStates';
import { fireEvent, render, screen } from '@testing-library/react';
import RadialChart from '.';
import type { RadialChartProps } from './RadialChart.types';

type Row = { goal: string; done: number };

const GOALS: Row[] = [
    { goal: 'steps', done: 72 },
    { goal: 'sleep', done: 54 },
];
const CONFIG = { steps: { label: 'Steps' }, sleep: { label: 'Sleep' } };

const renderChart = (props: Partial<RadialChartProps<Row>> = {}) =>
    render(
        <RadialChart
            data={GOALS}
            config={CONFIG}
            nameKey="goal"
            valueKey="done"
            max={100}
            animate={false}
            {...props}
        />,
    );

describe('RadialChart', () => {
    beforeEach(() => {
        mockChartSize();
    });

    describeChartStates({
        renderChart: (state) => renderChart(state),
        renderEmpty: () => renderChart({ data: [] }),
        skeleton: 'radial',
    });

    it('draws one ring per row with a track', () => {
        const { container } = renderChart();
        expect(
            container.querySelectorAll('.recharts-radial-bar-sector'),
        ).toHaveLength(2);
        expect(
            container.querySelectorAll(
                '.recharts-radial-bar-background-sector',
            ),
        ).toHaveLength(2);
        expect(
            screen.getByRole('button', { name: 'Sleep' }),
        ).toBeInTheDocument();
    });

    it('is a gauge with one row, a max and a half ring', () => {
        const { container } = renderChart({
            data: [{ goal: 'steps', done: 72 }],
            semicircle: true,
            centerLabel: { value: '72%', label: 'of goal' },
        });
        expect(
            container.querySelector('[data-slot="chart-center-label"]'),
        ).toHaveTextContent('72%of goal');
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('reports the clicked ring', () => {
        const onSliceClick = vi.fn();
        const { container } = renderChart({ onSliceClick });
        fireEvent.click(
            container.querySelectorAll('.recharts-radial-bar-sector')[1],
        );
        expect(onSliceClick).toHaveBeenCalledWith(GOALS[1], 1);
    });
});
