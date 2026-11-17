import { cn } from '@/utils/funcs/cn';
import { cva } from 'class-variance-authority';
import { StarIcon } from 'lucide-react';
import type { RatingStarProps } from './Rating.types';

const starVariants = cva('relative inline-flex shrink-0 [&_svg]:size-full', {
    variants: {
        size: {
            sm: 'size-4',
            default: 'size-5',
            lg: 'size-7',
        },
    },
    defaultVariants: { size: 'default' },
});

/** One star: an empty outline with the filled part clipped from the start. */
const RatingStar = ({ fill, size, icon }: RatingStarProps) => {
    const glyph = icon ?? <StarIcon />;

    return (
        <span className={starVariants({ size })} data-fill={fill}>
            <span className="flex size-full text-muted-foreground/40">
                {glyph}
            </span>
            <span
                className="absolute inset-y-0 start-0 overflow-hidden text-warning [&_svg]:fill-current"
                style={{ width: `${fill * 100}%` }}
            >
                <span className={cn(starVariants({ size }), 'flex')}>
                    {glyph}
                </span>
            </span>
        </span>
    );
};

export { RatingStar };
