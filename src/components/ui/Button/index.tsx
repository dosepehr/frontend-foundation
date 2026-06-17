'use client';

import type { FC } from 'react';
import { ArrowRightCircle } from 'lucide-react';
import { Button as ButtonComponent } from './components';
import { Spinner } from '../Spinner';
import type { ButtonWrapperProps } from './button.types';

const Button: FC<ButtonWrapperProps> = ({
    children,
    isLoading = false,
    loadingText = 'در حال دریافت',
    showArrow = false,
    disabled,
    ...props
}) => {
    return (
        <ButtonComponent disabled={disabled || isLoading} {...props}>
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
        </ButtonComponent>
    );
};

export default Button;

