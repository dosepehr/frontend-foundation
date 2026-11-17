import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import LoadMoreSentinel from '.';

const meta: Meta<typeof LoadMoreSentinel> = {
    title: 'UI/LoadMoreSentinel',
    component: LoadMoreSentinel,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof LoadMoreSentinel>;

export const Fetching: Story = {
    args: { isFetchingNextPage: true },
};

const PAGE_SIZE = 15;
const TOTAL = 60;

const InfiniteListDemo = () => {
    const [count, setCount] = useState(PAGE_SIZE);
    const [isFetching, setIsFetching] = useState(false);

    const fetchNext = () => {
        setIsFetching(true);
        setTimeout(() => {
            setCount((current) => Math.min(current + PAGE_SIZE, TOTAL));
            setIsFetching(false);
        }, 600);
    };

    return (
        <div
            // A scrolling region must be focusable so keyboard users can scroll it.
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
            aria-label="Items"
            role="region"
            className="h-64 w-56 overflow-y-auto rounded-md border border-border p-2"
        >
            <ul className="text-sm">
                {Array.from({ length: count }, (_, index) => (
                    <li key={index} className="py-1">
                        Item {index + 1}
                    </li>
                ))}
            </ul>
            <LoadMoreSentinel
                hasNextPage={count < TOTAL}
                isFetchingNextPage={isFetching}
                onFetchNextPage={fetchNext}
            />
        </div>
    );
};

export const InfiniteList: Story = {
    render: () => <InfiniteListDemo />,
};
