import { VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';
import { alertVariants } from './components';
import { LucideIcon } from 'lucide-react';

export type AlertProps = VariantProps<typeof alertVariants> & {
    title: string;
    children: ReactNode;
    Icon: LucideIcon;
};

