import ChartCard from '@/stories/helpers/chart/ChartCard';
import {
    dayMonth,
    SALES_FA,
    SALES_FA_CONFIG,
    shortMonth,
    TRAFFIC,
    TRAFFIC_CONFIG,
    VISITORS,
    VISITORS_CONFIG,
} from '@/stories/helpers/chart/chartData';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import BarChart from '.';

// Stories mix data shapes, so rows are typed loosely here.
type Row = Record<string, unknown>;

const meta = {
    title: 'Charts/BarChart',
    component: BarChart,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    args: {
        data: VISITORS,
        config: VISITORS_CONFIG,
        xKey: 'month',
        xFormatter: shortMonth,
        xLabel: 'Month',
        'aria-label': 'Visitors per month',
    },
    argTypes: {
        orientation: {
            control: 'inline-radio',
            options: ['vertical', 'horizontal'],
        },
        stack: {
            control: 'inline-radio',
            options: ['none', 'stacked', 'percent'],
        },
        locale: { control: 'inline-radio', options: ['en', 'fa'] },
    },
    render: (args) => (
        <ChartCard title="Visitors" description="January – June 2026">
            <BarChart {...args} />
        </ChartCard>
    ),
} satisfies Meta<typeof BarChart<Row>>;

export default meta;
type Story = StoryObj<Meta<typeof BarChart<Row>>>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const mobile = canvas.getByRole('button', { name: 'Mobile' });
        await userEvent.click(mobile);
        await expect(mobile).toHaveAttribute('aria-pressed', 'false');
        await userEvent.click(mobile);
    },
};

export const SingleSeriesWithValues: Story = {
    args: { series: ['desktop'], showValues: true },
};

export const Stacked: Story = { args: { stack: 'stacked' } };

export const PercentStack: Story = { args: { stack: 'percent' } };

export const Horizontal: Story = {
    args: {
        orientation: 'horizontal',
        series: ['desktop'],
        showValues: true,
        height: 280,
    },
};

/** Emphasis: one bar in color, the rest grayed. */
export const Highlight: Story = {
    args: {
        series: ['desktop'],
        highlight: (row) => row.month === 'February',
        showValues: true,
    },
};

export const TargetLine: Story = {
    args: {
        series: ['desktop'],
        referenceLines: [{ value: 250, label: 'Target', tone: 'success' }],
    },
};

export const LongSeriesWithBrush: Story = {
    args: {
        data: TRAFFIC,
        config: TRAFFIC_CONFIG,
        xKey: 'date',
        xFormatter: dayMonth,
        xLabel: 'Date',
        stack: 'stacked',
        brush: true,
        height: 340,
    },
};

export const ClickableBars: Story = {
    args: { series: ['desktop'], onPointClick: fn() },
};

export const WithTable: Story = { args: { showTable: true } };

export const PersianRtl: Story = {
    globals: { i18n: 'fa-IR' },
    args: {
        data: SALES_FA,
        config: SALES_FA_CONFIG,
        xKey: 'month',
        xFormatter: undefined,
        xLabel: 'ماه',
        locale: 'fa',
        'aria-label': 'فروش ماهانه',
    },
    render: (args) => (
        <div dir="rtl">
            <ChartCard title="فروش ماهانه" description="شش ماه نخست ۱۴۰۵">
                <BarChart {...args} />
            </ChartCard>
        </div>
    ),
};

export const Loading: Story = { args: { isLoading: true } };

export const Refetching: Story = { args: { isFetching: true } };

export const Empty: Story = { args: { data: [] } };

export const Error: Story = {
    args: { error: new globalThis.Error('500'), onRetry: fn() },
};
