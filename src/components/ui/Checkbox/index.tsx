'use client'

import { useId } from 'react'
import type { FC } from 'react'
import { cn } from '@/src/utils/funcs/cn'
import { Label } from '../Label'
import Asteriks from '../Asteriks'
import { Checkbox, checkboxWrapperVariants } from './components'
import type { CheckboxWrapperProps } from './checkbox.types'

const CheckboxWrapper: FC<CheckboxWrapperProps> = ({
    id,
    label,
    description,
    variant,
    className,
    disabled,
    required,
    ...props
}) => {
    const generatedId = useId()
    const checkboxId = id ?? generatedId

    return (
        <Label
            disabled={disabled}
            className={cn(checkboxWrapperVariants({ variant }), disabled && 'opacity-80 cursor-not-allowed!', className)}
        >
            <Checkbox
                id={checkboxId}
                variant={variant}
                disabled={disabled}
                required={required}
                className='mt-0.5'
                {...props}
            />
            <div className='grid gap-1 font-normal'>
                {label && (
                    <span className='flex items-center gap-1 text-sm leading-none font-medium'>
                        {label}
                        {required && <Asteriks />}
                    </span>
                )}
                {description && (
                    <span className='text-xs text-muted-foreground'>
                        {description}
                    </span>
                )}
            </div>
        </Label>
    )
}

export default CheckboxWrapper

export { Checkbox } from './components'
export type { CheckboxWrapperProps, CheckboxProps } from './checkbox.types'
