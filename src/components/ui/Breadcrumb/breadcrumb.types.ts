import type { ReactNode } from 'react';

export type BreadcrumbItemDef = {
    label: ReactNode;
    href?: string;
};

export type BreadcrumbWrapperProps = {
    items: BreadcrumbItemDef[];
    separator?: ReactNode;
    ellipsis?: boolean;
    maxItems?: number;
};
