import React, { FC } from 'react';
import { AlertProps } from './alert.props';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './components';

const AlertGroup: FC<AlertProps> = ({ title, children, variant, Icon }) => {
    const iconHandler = () => {
        const iconProps = { size: 20, className: 'shrink-0' };
        switch (variant) {
            case 'info':
                return <Info {...iconProps} />;
            case 'success':
                return <CheckCircle {...iconProps} />;
            case 'warning':
                return <AlertTriangle {...iconProps} />;
            case 'destructive':
                return <XCircle {...iconProps} />;
        }
    };
    return (
        <Alert variant={variant}>
            {Icon ? <Icon /> : iconHandler()}
            {title && <AlertTitle>{title}</AlertTitle>}
            <AlertDescription className='w-full'>{children}</AlertDescription>
        </Alert>
    );
};

export default AlertGroup;

