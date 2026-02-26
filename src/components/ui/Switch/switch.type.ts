import { VariantProps } from "class-variance-authority";
import { switchVariants } from ".";
import { Switch as SwitchPrimitive } from 'radix-ui';

export type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> &
    VariantProps<typeof switchVariants> & {
        size?: 'sm' | 'default';
        label?: string;
    };

