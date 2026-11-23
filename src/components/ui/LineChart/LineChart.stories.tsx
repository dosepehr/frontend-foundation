import ChartCard from '@/stories/helpers/chart/ChartCard';
import {
    dayMonth,
    REVENUE,
    REVENUE_CONFIG,
    SALES_FA,
    SALES_FA_CONFIG,
    TRAFFIC,
    TRAFFIC_CONFIG,
    usd,
} from '@/stories/helpers/chart/chartData';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import LineChart from '.';

// Stories mix data shapes, so rows are typed loosely here.
type Row = Record<string, unknown>;

const meta = {
    title: 'Charts/LineChart',
    component: LineChart,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    args: {
        data: TRAFFIC.slice(0, 30),
        config: TRAFFIC_CONFIG,
        xKey: 'date',
        xFormatter: dayMonth,
        xLabel: 'Date',
        'aria-label': 'Daily traffic',
    },
    argTypes: {
        curve: {
            control: 'select',
            options: ['monotone', 'linear', 'step', 'natural'],
        },
        dots: { control: 'inline-radio', options: ['none', 'end', 'all'] },
        locale: { control: 'inline-radio', options: ['en', 'fa'] },
    },
    render: (args) => (
        <ChartCard title="Traffic" description="June 2026, by source">
            <LineChart {...args} />
        </ChartCard>
    ),
} satisfies Meta<typeof LineChart<Row>>;

export default meta;
type Story = StoryObj<Meta<typeof LineChart<Row>>>;

export const Default: Story = {};

export const EndDots: Story = { args: { dots: 'end' } };

/** A dashed forecast picks up where the actuals end; gaps stay gaps. */
export const Forecast: Story = {
    args: {
        data: REVENUE,
        config: REVENUE_CONFIG,
        xKey: 'week',
        xFormatter: undefined,
        xLabel: 'Week',
        dashedSeries: ['forecast'],
        dots: 'all',
        valueFormatter: usd,
        yAxis: { tickFormatter: (value) => usd(Number(value)) },
        'aria-label': 'Weekly revenue',
    },
};

export const ConnectedGaps: Story = {
    args: { ...Forecast.args, connectNulls: true },
};

export const StepCurve: Story = { args: { curve: 'step', series: ['paid'] } };

export const WithBrush: Story = {
    args: { data: TRAFFIC, brush: true, height: 340 },
};

/** Two charts with one syncId share the tooltip position. */
export const Synced: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            <ChartCard title="Organic">
                <LineChart
                    {...args}
                    series={['organic']}
                    syncId="traffic"
                    height={180}
                />
            </ChartCard>
            <ChartCard title="Paid">
                <LineChart
                    {...args}
                    series={['paid']}
                    syncId="traffic"
                    height={180}
                />
            </ChartCard>
        </div>
    ),
};

export const ClickablePoints: Story = { args: { onPointClick: fn() } };

export const PersianRtl: Story = {
    globals: { i18n: 'fa-IR' },
    args: {
        data: SALES_FA,
        config: SALES_FA_CONFIG,
        xKey: 'month',
        xFormatter: undefined,
        xLabel: 'ماه',
        locale: 'fa',
        dots: 'end',
        'aria-label': 'فروش ماهانه',
    },
    render: (args) => (
        <div dir="rtl">
            <ChartCard title="فروش ماهانه">
                <LineChart {...args} />
            </ChartCard>
        </div>
    ),
};

/** Irregular timestamps spaced by real time, not evenly. */
export const TimeAxis: Story = {
    args: {
        data: [0, 1, 2, 5, 6, 12, 13, 14, 20].map((day, index) => ({
            at: Date.UTC(2026, 5, 1 + day),
            organic: 400 + index * 35 + (index % 2) * 60,
        })),
        xKey: 'at',
        series: ['organic'],
        xAxis: { type: 'time' },
        xFormatter: dayMonth,
        dots: 'all',
    },
};

export const Loading: Story = { args: { isLoading: true } };

export const Refetching: Story = { args: { isFetching: true } };

export const Empty: Story = { args: { data: [] } };

export const Error: Story = {
    args: { error: true, onRetry: fn() },
};
