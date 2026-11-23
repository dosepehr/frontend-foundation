import ChartCard from '@/stories/helpers/chart/ChartCard';
import { BROWSERS, BROWSERS_CONFIG } from '@/stories/helpers/chart/chartData';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import PieChart from '.';

// Stories mix data shapes, so rows are typed loosely here.
type Row = Record<string, unknown>;

const meta = {
    title: 'Charts/PieChart',
    component: PieChart,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    args: {
        data: BROWSERS,
        config: BROWSERS_CONFIG,
        nameKey: 'browser',
        valueKey: 'visitors',
        nameLabel: 'Browser',
        valueLabel: 'Visitors',
        centerLabel: { label: 'Visitors' },
        'aria-label': 'Visitors by browser',
    },
    argTypes: {
        maxSlices: { control: { type: 'number', min: 2, max: 8 } },
        locale: { control: 'inline-radio', options: ['en', 'fa'] },
    },
    render: (args) => (
        <ChartCard
            title="Browsers"
            description="Seven browsers, the smallest folded into Other"
        >
            <PieChart {...args} />
        </ChartCard>
    ),
} satisfies Meta<typeof PieChart<Row>>;

export default meta;
type Story = StoryObj<Meta<typeof PieChart<Row>>>;

export const Donut: Story = {};

export const PieWithLabels: Story = {
    args: { donut: false, showLabels: true, maxSlices: 4 },
};

export const CustomCenter: Story = {
    args: { centerLabel: { value: '+12%', label: 'vs last month' } },
};

export const ClickableSlices: Story = { args: { onSliceClick: fn() } };

export const PersianRtl: Story = {
    globals: { i18n: 'fa-IR' },
    args: { locale: 'fa', centerLabel: { label: 'بازدیدکننده' } },
    render: (args) => (
        <div dir="rtl">
            <ChartCard title="مرورگرها">
                <PieChart {...args} />
            </ChartCard>
        </div>
    ),
};

export const Loading: Story = { args: { isLoading: true } };

export const Refetching: Story = { args: { isFetching: true } };

export const Empty: Story = { args: { data: [] } };

export const Error: Story = { args: { error: true, onRetry: fn() } };
