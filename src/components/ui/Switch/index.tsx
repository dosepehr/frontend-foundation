'use client'

import { useId } from 'react'
import type { FC } from 'react'
import { cn } from '@/src/utils/funcs/cn'
import { Label } from '../Label/components'
import { Asteriks } from '../Asteriks/components'
import { Switch, switchWrapperVariants } from './components'
import type { SwitchWrapperProps } from './switch.types'

const SwitchWrapper: FC<SwitchWrapperProps> = ({
    id,
    label,
    description,
    variant,
    size,
    className,
    disabled,
    required,
    ...props
}) => {
    const generatedId = useId()
    const switchId = id ?? generatedId

    return (
        <Label
            disabled={disabled}
            className={cn(switchWrapperVariants({ variant }), disabled && 'opacity-80 cursor-not-allowed!', className)}
        >
            <Switch
                id={switchId}
                variant={variant}
                size={size}
                disabled={disabled}
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

export default SwitchWrapper
