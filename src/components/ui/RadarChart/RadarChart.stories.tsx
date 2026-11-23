import ChartCard from '@/stories/helpers/chart/ChartCard';
import { SKILLS, SKILLS_CONFIG } from '@/stories/helpers/chart/chartData';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import RadarChart from '.';

// Stories mix data shapes, so rows are typed loosely here.
type Row = Record<string, unknown>;

const meta = {
    title: 'Charts/RadarChart',
    component: RadarChart,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    args: {
        data: SKILLS,
        config: SKILLS_CONFIG,
        angleKey: 'skill',
        xLabel: 'Skill',
        max: 100,
        'aria-label': 'Team skills',
    },
    argTypes: {
        gridShape: { control: 'inline-radio', options: ['polygon', 'circle'] },
        dots: { control: 'inline-radio', options: ['none', 'all'] },
    },
    render: (args) => (
        <ChartCard title="Team skills" description="Self-assessed, out of 100">
            <RadarChart {...args} />
        </ChartCard>
    ),
} satisfies Meta<typeof RadarChart<Row>>;

export default meta;
type Story = StoryObj<Meta<typeof RadarChart<Row>>>;

export const Default: Story = {};

export const OutlinedCircle: Story = {
    args: { filled: false, gridShape: 'circle', dots: 'all' },
};

export const PersianRtl: Story = {
    globals: { i18n: 'fa-IR' },
    args: {
        data: [
            { skill: 'سرعت', frontend: 80, backend: 60 },
            { skill: 'کیفیت', frontend: 70, backend: 90 },
            { skill: 'تست', frontend: 55, backend: 80 },
            { skill: 'طراحی', frontend: 90, backend: 40 },
            { skill: 'مستندات', frontend: 60, backend: 70 },
        ],
        config: {
            frontend: { label: 'فرانت‌اند' },
            backend: { label: 'بک‌اند' },
        },
        xLabel: 'مهارت',
        locale: 'fa',
        'aria-label': 'مهارت‌های تیم',
    },
    render: (args) => (
        <div dir="rtl">
            <ChartCard title="مهارت‌های تیم">
                <RadarChart {...args} />
            </ChartCard>
        </div>
    ),
};

export const Loading: Story = { args: { isLoading: true } };

export const Refetching: Story = { args: { isFetching: true } };

export const Empty: Story = { args: { data: [] } };

export const Error: Story = { args: { error: true, onRetry: fn() } };
