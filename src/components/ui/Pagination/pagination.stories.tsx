import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from './components';

const meta = {
    title: 'UI/Pagination',
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink isActive>2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    ),
};

export const FirstPage: Story = {
    render: () => (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        aria-disabled
                        className="pointer-events-none opacity-50"
                    />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    ),
};

export const LastPage: Story = {
    render: () => (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious />
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>8</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>9</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink isActive>10</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext
                        aria-disabled
                        className="pointer-events-none opacity-50"
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    ),
};

export const WithMiddleEllipsis: Story = {
    render: () => (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>4</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink isActive>5</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>6</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>10</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    ),
};

export const Controlled: Story = {
    render: () => {
        const [page, setPage] = React.useState(1);
        const total = 8;

        return (
            <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-muted-foreground">
                    Page {page} of {total}
                </p>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage((p) => Math.max(1, p - 1));
                                }}
                                className={
                                    page === 1
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }
                            />
                        </PaginationItem>
                        {Array.from({ length: total }).map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    isActive={page === i + 1}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPage(i + 1);
                                    }}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage((p) => Math.min(total, p + 1));
                                }}
                                className={
                                    page === total
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        );
    },
};
