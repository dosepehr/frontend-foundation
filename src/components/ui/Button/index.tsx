'use client'

import type { FC } from 'react'
import { ArrowRightCircle } from 'lucide-react'
import { Button } from './components'
import { Spinner } from '../Spinner'
import type { ButtonWrapperProps } from './button.types'

const ButtonWrapper: FC<ButtonWrapperProps> = ({
    children,
    isLoading = false,
    loadingText = 'در حال دریافت',
    showArrow = false,
    disabled,
    ...props
}) => {
    return (
        <Button disabled={disabled || isLoading} {...props}>
            {isLoading ? (
                <>
                    {loadingText}
                    <Spinner />
                </>
            ) : (
                children
            )}
            {!isLoading && showArrow && (
                <ArrowRightCircle className='duration-150 group-hover/button:translate-x-1' />
            )}
        </Button>
    )
}

export default ButtonWrapper

export { Button, buttonVariants } from './components'
export type { ButtonWrapperProps } from './button.types'
