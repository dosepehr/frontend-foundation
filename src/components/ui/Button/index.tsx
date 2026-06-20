'use client';

import { ArrowRightCircle } from 'lucide-react';
import type { FC } from 'react';
import { Spinner } from '../Spinner/components';
import type { ButtonWrapperProps } from './button.types';
import { Button as ButtonComponent } from './components';

const Button: FC<ButtonWrapperProps> = ({
    children,
    isLoading = false,
    loadingText = 'Loading...',
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
                <ArrowRightCircle className="duration-150 group-hover/button:translate-x-1" />
            )}
        </ButtonComponent>
    );
};

export default Button;
