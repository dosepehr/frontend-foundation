import ChartCard from '@/stories/helpers/chart/ChartCard';
import {
    dayMonth,
    SALES_FA,
    SALES_FA_CONFIG,
    TRAFFIC,
    TRAFFIC_CONFIG,
} from '@/stories/helpers/chart/chartData';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import AreaChart from '.';

// Stories mix data shapes, so rows are typed loosely here.
type Row = Record<string, unknown>;

const meta = {
    title: 'Charts/AreaChart',
    component: AreaChart,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    args: {
        data: TRAFFIC.slice(0, 45),
        config: TRAFFIC_CONFIG,
        xKey: 'date',
        xFormatter: dayMonth,
        xLabel: 'Date',
        'aria-label': 'Daily traffic',
    },
    argTypes: {
        stack: {
            control: 'inline-radio',
            options: ['none', 'stacked', 'percent'],
        },
        fill: { control: 'inline-radio', options: ['wash', 'gradient'] },
        curve: {
            control: 'select',
            options: ['monotone', 'linear', 'step', 'natural'],
        },
    },
    render: (args) => (
        <ChartCard title="Traffic" description="June – July 2026">
            <AreaChart {...args} />
        </ChartCard>
    ),
} satisfies Meta<typeof AreaChart<Row>>;

export default meta;
type Story = StoryObj<Meta<typeof AreaChart<Row>>>;

export const Default: Story = {};

export const Gradient: Story = {
    args: { fill: 'gradient', series: ['organic'] },
};

export const Stacked: Story = { args: { stack: 'stacked' } };

export const PercentStack: Story = { args: { stack: 'percent' } };

export const LegendOnTop: Story = {
    args: { legend: { position: 'top' }, hiddenSeries: ['referral'] },
};

export const PersianRtl: Story = {
    globals: { i18n: 'fa-IR' },
    args: {
        data: SALES_FA,
        config: SALES_FA_CONFIG,
        xKey: 'month',
        xFormatter: undefined,
        xLabel: 'ماه',
        locale: 'fa',
        stack: 'stacked',
        'aria-label': 'فروش ماهانه',
    },
    render: (args) => (
        <div dir="rtl">
            <ChartCard title="فروش ماهانه">
                <AreaChart {...args} />
            </ChartCard>
        </div>
    ),
};

export const Loading: Story = { args: { isLoading: true } };

export const Refetching: Story = { args: { isFetching: true } };

export const Empty: Story = { args: { data: [] } };

export const Error: Story = { args: { error: true, onRetry: fn() } };
