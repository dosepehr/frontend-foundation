import { LucideIcon } from 'lucide-react';
import { Breadcrumb } from './components';

export type BreadcrumbItemDef = {
    label: string;
    href?: string;
    icon?: LucideIcon;
};

export type BreadcrumbGroupProps = React.ComponentProps<typeof Breadcrumb> & {
    items: BreadcrumbItemDef[];
    maxItems?: number;
    separator?: React.ReactNode;
};

