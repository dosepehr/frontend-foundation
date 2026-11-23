import ChartCard from '@/stories/helpers/chart/ChartCard';
import { GOALS, GOALS_CONFIG } from '@/stories/helpers/chart/chartData';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import RadialChart from '.';

// Stories mix data shapes, so rows are typed loosely here.
type Row = Record<string, unknown>;

const meta = {
    title: 'Charts/RadialChart',
    component: RadialChart,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    args: {
        data: GOALS,
        config: GOALS_CONFIG,
        nameKey: 'goal',
        valueKey: 'done',
        max: 100,
        valueFormatter: (value: number) => `${value}%`,
        centerLabel: false,
        'aria-label': 'Daily goals',
    },
    render: (args) => (
        <ChartCard title="Daily goals" description="Percent of each goal done">
            <RadialChart {...args} />
        </ChartCard>
    ),
} satisfies Meta<typeof RadialChart<Row>>;

export default meta;
type Story = StoryObj<Meta<typeof RadialChart<Row>>>;

export const Rings: Story = {};

export const Gauge: Story = {
    args: {
        data: [{ goal: 'steps', done: 72 }],
        semicircle: true,
        centerLabel: { value: '72%', label: 'of 10,000 steps' },
        height: 220,
    },
};

export const ClickableRings: Story = { args: { onSliceClick: fn() } };

export const PersianRtl: Story = {
    globals: { i18n: 'fa-IR' },
    args: {
        config: {
            steps: { label: 'قدم' },
            sleep: { label: 'خواب' },
            water: { label: 'آب' },
        },
        locale: 'fa',
        valueFormatter: (value: number) =>
            new Intl.NumberFormat('fa-IR', { style: 'percent' }).format(
                value / 100,
            ),
        'aria-label': 'اهداف روزانه',
    },
    render: (args) => (
        <div dir="rtl">
            <ChartCard title="اهداف روزانه">
                <RadialChart {...args} />
            </ChartCard>
        </div>
    ),
};

export const Loading: Story = { args: { isLoading: true } };

export const Refetching: Story = { args: { isFetching: true } };

export const Empty: Story = { args: { data: [] } };

export const Error: Story = { args: { error: true, onRetry: fn() } };
