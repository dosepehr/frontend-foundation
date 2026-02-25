import React, { FC } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './components';
import { TooltipProps } from './tooltip.type';

const TooltipGroup: FC<TooltipProps> = ({ children, trigger, side }) => {
    return (
        <Tooltip>
            <TooltipTrigger>{trigger}</TooltipTrigger>
            <TooltipContent side={side}>{children}</TooltipContent>
        </Tooltip>
    );
};

export default TooltipGroup;

