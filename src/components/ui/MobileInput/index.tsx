/* c8 ignore start */
'use client';
/* c8 ignore stop */

import Input from '@/components/ui/Input';
import { cn } from '@/utils/funcs/cn';
import { useMobileInput } from './hooks/useMobileInput/useMobileInput';
import type { MobileInputProps } from './MobileInput.types';

// Iranian mobile number. Shows what the user types, reports it normalized as
// `09xxxxxxxxx` and regroups it on blur. The number reads left to right, but
// only once there is one: an empty field keeps the page direction for its
// placeholder, and on an RTL page the number stays on the placeholder's side.
const MobileInput = ({
    value,
    defaultValue,
    onValueChange,
    separator,
    onBlur,
    className,
    ...props
}: MobileInputProps) => {
    const { display, handleChange, handleBlur } = useMobileInput({
        value,
        defaultValue,
        onValueChange,
        separator,
        onBlur,
    });

    return (
        <Input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir={display ? 'ltr' : undefined}
            {...props}
            className={cn('rtl:text-right', className)}
            value={display}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
};

export default MobileInput;
