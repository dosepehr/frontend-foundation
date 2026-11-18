import type { InputProps } from '@/components/ui/Input/Input.types';
import type { UseMobileInputOptions } from './hooks/useMobileInput/useMobileInput';

export type MobileInputProps = Omit<
    InputProps,
    'type' | 'value' | 'defaultValue' | 'onChange' | 'onBlur'
> &
    UseMobileInputOptions;
