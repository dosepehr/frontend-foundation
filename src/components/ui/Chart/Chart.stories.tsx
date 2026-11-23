import ChartFrame from '@/components/ui/ChartFrame';
import ChartCard from '@/stories/helpers/chart/ChartCard';
import {
    shortMonth,
    VISITORS,
    VISITORS_CONFIG,
} from '@/stories/helpers/chart/chartData';
import { withSlotColors } from '@/utils/funcs/charts';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { fn } from 'storybook/test';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '.';

const config = withSlotColors(VISITORS_CONFIG);

const meta = {
    title: 'Charts/Chart (primitives)',
    component: ChartContainer,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Build any Recharts chart by hand with the themed primitives. */
export const Composition: Story = {
    args: { config, children: <></> },
    render: () => (
        <ChartCard
            title="Composed by hand"
            description="Recharts + ChartContainer, tooltip and legend"
        >
            <ChartContainer
                config={config}
                className="aspect-auto h-[260px] w-full"
            >
                <BarChart accessibilityLayer data={VISITORS}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={shortMonth}
                    />
                    <ChartTooltip
                        content={<ChartTooltipContent indicator="line" />}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                        dataKey="desktop"
                        fill="var(--color-desktop)"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={24}
                    />
                    <Bar
                        dataKey="mobile"
                        fill="var(--color-mobile)"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={24}
                    />
                </BarChart>
            </ChartContainer>
        </ChartCard>
    ),
};

type DemoState = 'ready' | 'loading' | 'refetching' | 'empty' | 'error';

const StatesDemo = () => {
    const [state, setState] = useState<DemoState>('ready');
    return (
        <ChartCard
            title="Hand-built chart with states"
            description="Wrap your own Recharts chart in ChartFrame to get the shared states"
        >
            <div
                className="mb-3 flex flex-wrap gap-1.5"
                role="group"
                aria-label="State"
            >
                {(
                    [
                        'ready',
                        'loading',
                        'refetching',
                        'empty',
                        'error',
                    ] as const
                ).map((option) => (
                    <button
                        key={option}
                        type="button"
                        aria-pressed={state === option}
                        onClick={() => setState(option)}
                        className="rounded-md border px-2 py-1 text-xs aria-pressed:border-primary aria-pressed:bg-primary/10"
                    >
                        {option}
                    </button>
                ))}
            </div>
            <ChartFrame
                height={240}
                label="Visitors"
                skeleton="bar"
                isLoading={state === 'loading'}
                isFetching={state === 'refetching'}
                isEmpty={state === 'empty'}
                error={state === 'error'}
                onRetry={fn()}
            >
                <ChartContainer
                    config={config}
                    className="aspect-auto size-full"
                >
                    <BarChart accessibilityLayer data={VISITORS}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={shortMonth}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                            dataKey="desktop"
                            fill="var(--color-desktop)"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={24}
                        />
                    </BarChart>
                </ChartContainer>
            </ChartFrame>
        </ChartCard>
    );
};

/** Primitives own no state: ChartFrame adds loading, empty and error. */
export const WithStates: Story = {
    args: { config, children: <></> },
    render: () => <StatesDemo />,
};
