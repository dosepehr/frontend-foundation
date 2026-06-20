import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Skeleton } from './components';

const meta: Meta<typeof Skeleton> = {
    title: 'UI/Skeleton',
    component: Skeleton,
    tags: ['autodocs'],
    argTypes: {
        className: {
            control: 'text',
            description: 'Width, height, and shape via Tailwind classes',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
    args: {
        className: 'h-4 w-48',
    },
};

export const Circle: Story = {
    args: {
        className: 'size-12 rounded-full',
    },
};

export const Card: Story = {
    render: () => (
        <div className="flex w-72 flex-col gap-3 rounded-xl border p-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="mt-1 flex gap-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
            </div>
        </div>
    ),
    args: {},
};

export const ProfileCard: Story = {
    render: () => (
        <div className="flex w-72 items-center gap-4 rounded-xl border p-4">
            <Skeleton className="size-14 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
            </div>
        </div>
    ),
    args: {},
};

export const List: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <Skeleton className="size-10 shrink-0 rounded-full" />
                    <div className="flex flex-1 flex-col gap-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    ),
    args: {},
};

export const Table: Story = {
    render: () => (
        <div className="flex w-full max-w-lg flex-col gap-3">
            <div className="flex gap-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="h-px bg-border" />
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            ))}
        </div>
    ),
    args: {},
};

export const FormFields: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-9 w-full rounded-md" />
                </div>
            ))}
            <Skeleton className="h-9 w-full rounded-md" />
        </div>
    ),
    args: {},
};
