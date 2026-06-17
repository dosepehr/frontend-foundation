'use client'

import { Fragment } from 'react'
import type { FC } from 'react'
import Button from '../Button'
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
                    <Fragment key={key ?? index}>
                        <Button {...buttonProps} />
                        {separator && !isLast && (
                            <ButtonGroupSeparator
                                orientation={orientation === 'vertical' ? 'horizontal' : 'vertical'}
                            />
                        )}
                    </Fragment>
                )
            })}
        </ButtonGroup>
    )
}

export default ButtonGroupWrapper

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants } from './components'
export type { ButtonGroupWrapperProps, ButtonGroupItemDef } from './button-group.types'
