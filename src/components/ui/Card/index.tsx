import { Button } from '../Button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from './components';
import React, { ReactNode } from 'react';

type CardGroupProps = {
    title?: string;
    description?: string;
    action?: {
        label: string;
        onClick?: () => void;
    };
    children?: ReactNode;
    footer?: ReactNode;
};

const CardGroup = ({
    title,
    description,
    action,
    children,
    footer,
}: CardGroupProps) => {
    return (
        <Card>
            {(title || description || action) && (
                <CardHeader>
                    {title && <CardTitle>{title}</CardTitle>}
                    {description && (
                        <CardDescription>{description}</CardDescription>
                    )}
                    {action && (
                        <CardAction>
                            <Button variant='link' onClick={action.onClick}>
                                {action.label}
                            </Button>
                        </CardAction>
                    )}
                </CardHeader>
            )}

            <CardContent>{children}</CardContent>

            <CardFooter>{footer}</CardFooter>
        </Card>
    );
};

export default CardGroup;

