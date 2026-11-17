/* c8 ignore start */
'use client';
/* c8 ignore stop */

import Field, {
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/Field';
import { cn } from '@/utils/funcs/cn';
import { useId } from 'react';
import { RatingStar } from './components';
import { starFill, useRating } from './hooks/useRating/useRating';
import type { RatingProps } from './Rating.types';

const Rating = ({
    max = 5,
    size = 'default',
    icon,
    label,
    description,
    error,
    required,
    name,
    'aria-label': ariaLabel,
    id,
    className,
    readOnly = false,
    disabled = false,
    ...options
}: RatingProps) => {
    const generatedId = useId();
    const ratingId = id ?? generatedId;
    const rating = useRating({ ...options, max, readOnly, disabled });
    const accessibleName = ariaLabel ?? label ?? 'Rating';
    const valueText = `${rating.value} out of ${max}`;

    const interactiveProps = rating.isInteractive
        ? {
              role: 'slider',
              tabIndex: 0,
              'aria-valuemin': 0,
              'aria-valuemax': max,
              'aria-valuenow': rating.value,
              'aria-valuetext': valueText,
              'aria-required': required || undefined,
              'aria-invalid': !!error || undefined,
              onKeyDown: rating.onKeyDown,
              onPointerLeave: rating.onPointerLeave,
          }
        : {
              role: 'img',
              'aria-disabled': disabled || undefined,
          };

    return (
        <Field
            data-invalid={!!error || undefined}
            className={cn('relative w-auto pb-1', className)}
        >
            {label && (
                <FieldLabel
                    htmlFor={ratingId}
                    required={required}
                    className="text-foreground"
                >
                    {label}
                </FieldLabel>
            )}
            {description && (
                <FieldDescription className="text-muted-foreground">
                    {description}
                </FieldDescription>
            )}
            <div
                id={ratingId}
                data-slot="rating"
                aria-label={
                    rating.isInteractive
                        ? accessibleName
                        : `${accessibleName}: ${valueText}`
                }
                className={cn(
                    'flex w-fit items-center gap-0.5 rounded-sm outline-none',
                    'focus-visible:ring-3 focus-visible:ring-primary/50',
                    rating.isInteractive && 'cursor-pointer',
                    disabled && 'cursor-not-allowed opacity-50',
                )}
                {...interactiveProps}
            >
                {Array.from({ length: max }, (_, index) => (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- the keyboard is handled by the slider container
                    <span
                        key={index}
                        onPointerMove={(event) =>
                            rating.onStarPointerMove(event, index)
                        }
                        onClick={(event) => rating.onStarClick(event, index)}
                    >
                        <RatingStar
                            fill={starFill(index, rating.displayValue)}
                            size={size}
                            icon={icon}
                        />
                    </span>
                ))}
            </div>
            {name && (
                <input
                    type="hidden"
                    name={name}
                    value={rating.value}
                    disabled={disabled}
                />
            )}
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
};

export default Rating;
