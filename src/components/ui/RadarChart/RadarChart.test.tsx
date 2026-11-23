import { mockChartSize } from '@/test/chartSize';
import { describeChartStates } from '@/test/chartStates';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RadarChart from '.';
import type { RadarChartProps } from './RadarChart.types';

type Row = { skill: string; alice: number; bob: number };

const DATA: Row[] = [
    { skill: 'Speed', alice: 80, bob: 60 },
    { skill: 'Power', alice: 70, bob: 90 },
    { skill: 'Range', alice: 50, bob: 75 },
    { skill: 'Defense', alice: 65, bob: 40 },
];
const CONFIG = { alice: { label: 'Alice' }, bob: { label: 'Bob' } };

const renderChart = (props: Partial<RadarChartProps<Row>> = {}) =>
    render(
        <RadarChart
            data={DATA}
            config={CONFIG}
            angleKey="skill"
            animate={false}
            {...props}
        />,
    );

const polygon = (container: HTMLElement, key: string) =>
    container.querySelector(
        `.recharts-radar-polygon path[stroke="var(--color-${key})"]`,
    );

describe('RadarChart', () => {
    beforeEach(() => {
        mockChartSize();
    });

    describeChartStates({
        renderChart: (state) => renderChart(state),
        renderEmpty: () => renderChart({ data: [] }),
        skeleton: 'radar',
    });

    it('draws a washed polygon per series on a polygon web', () => {
        const { container } = renderChart();
        expect(polygon(container, 'alice')).toHaveAttribute(
            'fill-opacity',
            '0.1',
        );
        expect(polygon(container, 'bob')).toBeInTheDocument();
        expect(
            container.querySelector('.recharts-polar-angle-axis'),
        ).toHaveTextContent('Speed');
        expect(
            container.querySelector('.recharts-polar-grid-concentric-polygon'),
        ).toBeInTheDocument();
    });

    it('outlines series on a circular web', () => {
        const { container } = renderChart({
            filled: false,
            gridShape: 'circle',
        });
        expect(polygon(container, 'alice')).toHaveAttribute(
            'fill-opacity',
            '0',
        );
        expect(
            container.querySelector('.recharts-polar-grid-concentric-circle'),
        ).toBeInTheDocument();
    });

    it('toggles series from the legend', async () => {
        const user = userEvent.setup();
        const { container } = renderChart();
        await user.click(screen.getByRole('button', { name: 'Bob' }));
        expect(polygon(container, 'bob')).not.toBeInTheDocument();
    });

    it('lists the spokes in the table', () => {
        renderChart({ xLabel: 'Skill' });
        expect(
            screen.getByRole('columnheader', { name: 'Skill' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('rowheader', { name: 'Defense' }),
        ).toBeInTheDocument();
    });
});
