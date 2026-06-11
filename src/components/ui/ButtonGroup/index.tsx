'use client'

import type { FC } from 'react'
import ButtonWrapper from '../Button'
import { ButtonGroup, ButtonGroupSeparator } from './components'
import type { ButtonGroupWrapperProps } from './button-group.types'

const ButtonGroupWrapper: FC<ButtonGroupWrapperProps> = ({
    items,
    orientation = 'horizontal',
    separator = false,
    className,
}) => {
    return (
        <ButtonGroup orientation={orientation} className={className}>
            {items.map((item, index) => {
                const { key, ...buttonProps } = item
                const isLast = index === items.length - 1

                return (
                    <>
                        <ButtonWrapper key={key ?? index} {...buttonProps} />
                        {separator && !isLast && (
                            <ButtonGroupSeparator
                                key={`sep-${index}`}
                                orientation={orientation === 'vertical' ? 'horizontal' : 'vertical'}
                            />
                        )}
                    </>
                )
            })}
        </ButtonGroup>
    )
}

export default ButtonGroupWrapper

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants } from './components'
export type { ButtonGroupWrapperProps, ButtonGroupItemDef } from './button-group.types'
