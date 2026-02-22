import { VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { alertVariants } from './components';

export type AlertProps = VariantProps<typeof alertVariants> & {
    title?: string;
    children: ReactNode;
    Icon?: LucideIcon;
};

