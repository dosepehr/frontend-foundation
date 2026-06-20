/* c8 ignore start */
'use client';
/* c8 ignore stop */

import { cn } from '@/src/utils/funcs/cn';
import type { VariantProps } from 'class-variance-authority';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import * as React from 'react';
import { buttonVariants } from '../Button/components';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
    return (
        <nav
            role="navigation"
            aria-label="pagination"
            data-slot="pagination"
            className={cn('mx-auto flex w-full justify-center', className)}
            {...props}
        />
    );
}

function PaginationContent({
    className,
    ...props
}: React.ComponentProps<'ul'>) {
    return (
        <ul
            data-slot="pagination-content"
            className={cn('flex flex-row items-center gap-1', className)}
            {...props}
        />
    );
}

function PaginationItem({ className, ...props }: React.ComponentProps<'li'>) {
    return (
        <li
            data-slot="pagination-item"
            className={cn('', className)}
            {...props}
        />
    );
}

type PaginationLinkProps = {
    isActive?: boolean;
} & Pick<VariantProps<typeof buttonVariants>, 'size'> &
    React.ComponentProps<'a'>;

function PaginationLink({
    className,
    isActive,
    size = 'icon',
    ...props
}: PaginationLinkProps) {
    return (
        <a
            aria-current={isActive ? 'page' : undefined}
            data-slot="pagination-link"
            data-active={isActive}
            className={cn(
                buttonVariants({
                    variant: isActive ? 'default' : 'ghost',
                    size,
                }),
                'cursor-pointer',
                className,
            )}
            {...props}
        />
    );
}

function PaginationPrevious({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) {
    return (
        <PaginationLink
            aria-label="Go to previous page"
            size="default"
            className={cn('gap-1 px-3', className)}
            {...props}
        >
            <ChevronLeft className="size-4 rtl:rotate-180" />
            <span>Previous</span>
        </PaginationLink>
    );
}

function PaginationNext({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) {
    return (
        <PaginationLink
            aria-label="Go to next page"
            size="default"
            className={cn('gap-1 px-3', className)}
            {...props}
        >
            <span>Next</span>
            <ChevronRight className="size-4 rtl:rotate-180" />
        </PaginationLink>
    );
}

function PaginationEllipsis({
    className,
    ...props
}: React.ComponentProps<'span'>) {
    return (
        <span
            aria-hidden
            data-slot="pagination-ellipsis"
            className={cn(
                'flex size-8 items-center justify-center text-muted-foreground',
                className,
            )}
            {...props}
        >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">More pages</span>
        </span>
    );
}

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
};
