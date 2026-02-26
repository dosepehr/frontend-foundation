import type { FC } from 'react';

const ErrorMessage: FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return (
        <p
            className={`absolute text-destructive text-xs -bottom-5 ${className}`}
        >
            {children}
        </p>
    );
};

export default ErrorMessage;

