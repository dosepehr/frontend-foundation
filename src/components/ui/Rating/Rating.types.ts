import type { ReactNode } from 'react';
import type { UseRatingOptions } from './hooks/useRating/useRating';

export type RatingSize = 'sm' | 'default' | 'lg';

export type RatingProps = UseRatingOptions & {
    size?: RatingSize;
    /** Icon used for each star; defaults to a star. */
    icon?: ReactNode;
    label?: string;
    description?: string;
    error?: string;
    required?: boolean;
    /** Submits the value in forms through a hidden input. */
    name?: string;
    /** Accessible name when there is no visible label. */
    'aria-label'?: string;
    id?: string;
    className?: string;
};

export type RatingStarProps = {
    /** 0 (empty) to 1 (full). */
    fill: number;
    size: RatingSize;
    icon?: ReactNode;
};
