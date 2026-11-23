import { mockChartSize } from '@/test/chartSize';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MonitorIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Bar, BarChart } from 'recharts';
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from '.';
import type { ChartConfig } from './Chart.types';
import { ChartContext } from './hooks/useChart/useChart';

const CONFIG: ChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', theme: { light: '#111', dark: '#eee' } },
    tablet: { label: 'Tablet', icon: MonitorIcon },
};

const inChart = (children: ReactNode) => (
    <ChartContext.Provider value={{ config: CONFIG }}>
        {children}
    </ChartContext.Provider>
);

const entry = (dataKey: string, value: number, color?: string) => ({
    dataKey,
    name: dataKey,
    value,
    color,
    payload: {},
    graphicalItemId: dataKey,
});

const PAYLOAD = [entry('desktop', 1284, 'red'), entry('mobile', 80, 'blue')];

describe('ChartContainer', () => {
    beforeEach(() => {
        mockChartSize();
    });

    it('themes the chart with its config colors', () => {
        const { container } = render(
            <ChartContainer config={CONFIG} id="sales">
                <BarChart data={[{ m: 'Jan', desktop: 1 }]}>
                    <Bar dataKey="desktop" isAnimationActive={false} />
                </BarChart>
            </ChartContainer>,
        );
        const root = container.querySelector('[data-slot="chart"]');
        expect(root).toHaveAttribute('data-chart', 'chart-sales');
        const css = root?.querySelector('style')?.textContent;
        expect(css).toContain('[data-chart=chart-sales]');
        expect(css).toContain('--color-mobile: #111');
        expect(css).toContain('.dark [data-chart=chart-sales]');
        expect(
            container.querySelector('.recharts-bar-rectangle'),
        ).toBeInTheDocument();
    });
});

describe('ChartTooltipContent', () => {
    it('renders nothing while inactive', () => {
        const { container } = render(
            inChart(<ChartTooltipContent active={false} payload={PAYLOAD} />),
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('lists every series with labels from the config', () => {
        render(
            inChart(
                <ChartTooltipContent active payload={PAYLOAD} label="Jan" />,
            ),
        );
        expect(screen.getByText('Jan')).toBeInTheDocument();
        expect(screen.getByText('Desktop')).toBeInTheDocument();
        expect(screen.getByText('1,284')).toBeInTheDocument();
        expect(screen.getByText('Mobile')).toBeInTheDocument();
    });

    it('formats values and labels', () => {
        render(
            inChart(
                <ChartTooltipContent
                    active
                    payload={PAYLOAD}
                    label="Jan"
                    labelFormatter={(label) => `Month ${String(label)}`}
                    valueFormatter={(value) => `$${value}`}
                />,
            ),
        );
        expect(screen.getByText('Month Jan')).toBeInTheDocument();
        expect(screen.getByText('$1284')).toBeInTheDocument();
    });

    it('hides the label and indicator', () => {
        const { container } = render(
            inChart(
                <ChartTooltipContent
                    active
                    payload={PAYLOAD}
                    label="Jan"
                    hideLabel
                    hideIndicator
                />,
            ),
        );
        expect(screen.queryByText('Jan')).not.toBeInTheDocument();
        expect(
            container.querySelector('[data-slot="chart-indicator"]'),
        ).not.toBeInTheDocument();
    });

    it('nests the label beside a single line-keyed row', () => {
        const { container } = render(
            inChart(
                <ChartTooltipContent
                    active
                    payload={[PAYLOAD[0]]}
                    label="Jan"
                    indicator="line"
                />,
            ),
        );
        expect(
            container.querySelector('[data-slot="chart-indicator"]'),
        ).toHaveClass('w-1');
        expect(screen.getByText('Jan').parentElement).toHaveTextContent(
            'JanDesktop',
        );
    });

    it('uses a custom row formatter', () => {
        render(
            inChart(
                <ChartTooltipContent
                    active
                    payload={PAYLOAD}
                    formatter={(value, name) =>
                        `${String(name)}=${String(value)}`
                    }
                />,
            ),
        );
        expect(screen.getByText('desktop=1284')).toBeInTheDocument();
    });

    it('shows a config icon instead of the indicator', () => {
        const { container } = render(
            inChart(
                <ChartTooltipContent active payload={[entry('tablet', 3)]} />,
            ),
        );
        expect(container.querySelector('svg')).toBeInTheDocument();
    });
});

describe('ChartLegendContent', () => {
    const payload = [
        {
            value: 'desktop',
            dataKey: 'desktop',
            color: 'red',
            type: 'square' as const,
        },
        {
            value: 'mobile',
            dataKey: 'mobile',
            color: 'blue',
            type: 'square' as const,
        },
    ];

    it('lists config labels with swatches', () => {
        const { container } = render(
            inChart(<ChartLegendContent payload={payload} />),
        );
        expect(screen.getByText('Desktop')).toBeInTheDocument();
        expect(container.querySelector('span[aria-hidden]')).toHaveClass(
            'size-2',
        );
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('toggles series as buttons', async () => {
        const user = userEvent.setup();
        const onItemClick = vi.fn();
        render(
            inChart(
                <ChartLegendContent
                    payload={payload}
                    shape="line"
                    onItemClick={onItemClick}
                    hiddenKeys={new Set(['mobile'])}
                />,
            ),
        );
        expect(screen.getByRole('button', { name: 'Mobile' })).toHaveAttribute(
            'aria-pressed',
            'false',
        );
        await user.click(screen.getByRole('button', { name: 'Desktop' }));
        expect(onItemClick).toHaveBeenCalledWith('desktop');
    });

    it('renders nothing without items', () => {
        const { container } = render(
            inChart(<ChartLegendContent payload={[]} />),
        );
        expect(container).toBeEmptyDOMElement();
    });
});
