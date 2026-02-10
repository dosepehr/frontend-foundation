import { ReactNode } from 'react';

export type AlertDialogProps = {
    trigger: ReactNode;
    title: string;
    description?: ReactNode;
    children?: ReactNode;
};

