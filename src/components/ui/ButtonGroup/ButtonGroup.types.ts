import { type ButtonWrapperProps } from '@/components/ui/Button/Button.types';
import type { VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import type { buttonGroupVariants } from './components';

export type ButtonGroupItemDef = ButtonWrapperProps & {
    key?: string;
};

export type ButtonGroupWrapperProps = VariantProps<
    typeof buttonGroupVariants
> & {
    items: ButtonGroupItemDef[];
    separator?: boolean;
    className?: string;
    children?: ReactNode;
};
