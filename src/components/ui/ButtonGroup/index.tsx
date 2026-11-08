'use client';

import Button from '@/components/ui/Button';
import type { FC } from 'react';
import { Fragment } from 'react';
import type { ButtonGroupWrapperProps } from './ButtonGroup.types';
import { ButtonGroup, ButtonGroupSeparator } from './components';

const ButtonGroupWrapper: FC<ButtonGroupWrapperProps> = ({
    items,
    orientation = 'horizontal',
    separator = false,
    className,
}) => {
    return (
        <ButtonGroup orientation={orientation} className={className}>
            {items.map((item, index) => {
                const { key, ...buttonProps } = item;
                const isLast = index === items.length - 1;

                return (
                    <Fragment key={key ?? index}>
                        <Button {...buttonProps} />
                        {separator && !isLast && (
                            <ButtonGroupSeparator
                                orientation={
                                    orientation === 'vertical'
                                        ? 'horizontal'
                                        : 'vertical'
                                }
                            />
                        )}
                    </Fragment>
                );
            })}
        </ButtonGroup>
    );
};

export default ButtonGroupWrapper;

export type {
    ButtonGroupItemDef,
    ButtonGroupWrapperProps,
} from './ButtonGroup.types';
export {
    ButtonGroup,
    ButtonGroupSeparator,
    ButtonGroupText,
    buttonGroupVariants,
} from './components';
