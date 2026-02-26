import React from 'react';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from './components';
import { EmptyGroupProps } from './empty.types';

const EmptyGroup = ({
    media,
    title = 'No data',
    description = 'No data found',
    children,
    mediaVariant = 'icon',
}: EmptyGroupProps) => {
    return (
        <Empty>
            <EmptyHeader>
                {media && (
                    <EmptyMedia variant={mediaVariant}>{media}</EmptyMedia>
                )}
                {title && <EmptyTitle>{title}</EmptyTitle>}
                {description && (
                    <EmptyDescription>{description}</EmptyDescription>
                )}
            </EmptyHeader>

            <EmptyContent>{children}</EmptyContent>
        </Empty>
    );
};

export default EmptyGroup;

