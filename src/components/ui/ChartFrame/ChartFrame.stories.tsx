import ChartCard from '@/stories/helpers/chart/ChartCard';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import ChartFrame from '.';

const meta = {
    title: 'Charts/ChartFrame',
    component: ChartFrame,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    args: {
        isEmpty: false,
        height: 240,
        label: 'Sales',
        children: (
            <div className="flex size-full items-center justify-center rounded-md border border-dashed text-sm text-foreground">
                Any chart
            </div>
        ),
    },
    argTypes: {
        skeleton: {
            control: 'inline-radio',
            options: ['cartesian', 'bar', 'pie', 'radial', 'radar'],
        },
        locale: { control: 'inline-radio', options: ['en', 'fa'] },
    },
    render: (args) => (
        <ChartCard title="Sales">
            <ChartFrame {...args} />
        </ChartCard>
    ),
} satisfies Meta<typeof ChartFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const LoadingCartesian: Story = { args: { isLoading: true } };

export const LoadingBar: Story = { args: { isLoading: true, skeleton: 'bar' } };

export const LoadingPie: Story = { args: { isLoading: true, skeleton: 'pie' } };

export const LoadingRadial: Story = {
    args: { isLoading: true, skeleton: 'radial' },
};

export const LoadingRadar: Story = {
    args: { isLoading: true, skeleton: 'radar' },
};

export const Refetching: Story = { args: { isFetching: true } };

export const Empty: Story = { args: { isEmpty: true } };

export const Error: Story = { args: { error: true, onRetry: fn() } };

export const PersianStates: Story = {
    globals: { i18n: 'fa-IR' },
    args: { error: true, onRetry: fn(), locale: 'fa' },
    render: (args) => (
        <div dir="rtl">
            <ChartCard title="فروش">
                <ChartFrame {...args} />
            </ChartCard>
        </div>
    ),
};
