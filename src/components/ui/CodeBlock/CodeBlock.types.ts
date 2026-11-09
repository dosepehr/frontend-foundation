import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import type Button from '../Button';
import type { codeBlockLineVariants, codeBlockVariants } from './components';

export type CodeBlockProps = ComponentProps<'div'> &
    VariantProps<typeof codeBlockVariants> & {
        /** `"sm"` has tighter padding and `text-xs` code, for tool output. */
        size?: 'default' | 'sm';
    };

export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
    /** The text to copy. */
    value: string;
};

export type CodeBlockContentProps = ComponentProps<'pre'> & {
    /** Wrap long lines instead of scrolling. */
    wrap?: boolean;
    /** Number each line. A string child is split into lines. */
    lineNumbers?: boolean;
    /** The number of the first line, when `lineNumbers` is set. */
    startLine?: number;
};

export type CodeBlockLineProps = ComponentProps<'span'> &
    VariantProps<typeof codeBlockLineVariants>;
