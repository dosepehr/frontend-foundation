import type { VariantProps } from 'class-variance-authority';
import type { Slider as SliderPrimitive } from 'radix-ui';
import type * as React from 'react';
import { type rangeVariants } from '.';

export type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> &
    VariantProps<typeof rangeVariants>;
