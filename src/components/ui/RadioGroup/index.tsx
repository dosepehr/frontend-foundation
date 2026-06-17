'use client'

import { useId } from 'react'
import type { FC } from 'react'
import { cn } from '@/src/utils/funcs/cn'
import { Label } from '../Label/components'
import { Asteriks } from '../Asteriks/components'
import { RadioGroup, RadioGroupItem, radioGroupWrapperVariants } from './components'
import type { RadioGroupWrapperProps } from './radio-group.types'

const RadioGroupWrapper: FC<RadioGroupWrapperProps> = ({
    options,
    variant,
    className,
    disabled,
    required,
    orientation = 'vertical',
    ...props
}) => {
    const baseId = useId()

    return (
        <RadioGroup
            disabled={disabled}
            required={required}
            orientation={orientation}
            className={cn(
                orientation === 'horizontal' ? 'flex flex-wrap gap-2' : 'grid gap-2',
                className
            )}
            {...props}
        >
            {options.map((option) => {
                const itemId = `${baseId}-${option.value}`
                const isDisabled = disabled || option.disabled

                return (
                    <Label
                        key={option.value}
                        htmlFor={itemId}
                        disabled={isDisabled}
                        className={cn(
                            radioGroupWrapperVariants({ variant }),
                            isDisabled && 'opacity-80 cursor-not-allowed!'
                        )}
                    >
                        <RadioGroupItem
                            id={itemId}
                            value={option.value}
                            variant={variant}
                            disabled={isDisabled}
                            className='mt-0.5'
                        />
                        <div className='grid gap-1 font-normal'>
                            <span className='flex items-center gap-1 text-sm leading-none font-medium'>
                                {option.label}
                                {required && <Asteriks />}
                            </span>
                            {option.description && (
                                <span className='text-xs text-muted-foreground'>
                                    {option.description}
                                </span>
                            )}
                        </div>
                    </Label>
                )
            })}
        </RadioGroup>
    )
}

export default RadioGroupWrapper
