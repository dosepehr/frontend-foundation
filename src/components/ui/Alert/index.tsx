import React, { FC } from 'react';
import { Alert, AlertDescription, AlertTitle } from './components';
import { AlertProps } from './alert.props';

const AlertGroup: FC<AlertProps> = ({ title, children, variant, Icon }) => {
    return (
        <Alert variant={variant}>
            <Icon />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{children}</AlertDescription>
        </Alert>
    );
};

export default AlertGroup;

