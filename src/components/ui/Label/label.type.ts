import { ComponentProps } from 'react';
import { Label as LabelPrimitive } from 'radix-ui';

export type LabelProps = ComponentProps<typeof LabelPrimitive.Root> & {
    disabled?: boolean;
    required?: boolean;
};

