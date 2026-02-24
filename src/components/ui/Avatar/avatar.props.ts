import { ReactNode } from 'react';

type AvatarSize = 'default' | 'sm' | 'lg';

export type AvatarItem = {
    src?: string;
    fallback: string;
    badge?: boolean;
    alt?: string;
    badgeIcon?: ReactNode;
};

export type AvatarGroupProps = {
    avatars: AvatarItem[];
    size?: AvatarSize;
    max?: number;
    className?: string;
    containerClassName?: string;
    countClassName?: string;
};

