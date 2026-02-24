import { cn } from '@/utils/funcs/cn';
import { AvatarGroupProps } from './avatar.props';
import {
    Avatar,
    AvatarBadge,
    AvatarContainer,
    AvatarFallback,
    AvatarGroupCount,
    AvatarImage,
} from './components';

const AvatarGroup = ({
    avatars,
    size = 'default',
    max,
    className,
    containerClassName,
    countClassName,
}: AvatarGroupProps) => {
    const visibleAvatars = max ? avatars.slice(0, max) : avatars;
    const remainingCount = max ? avatars.length - max : 0;

    return (
        <AvatarContainer className={cn(containerClassName)}>
            {visibleAvatars.map((avatar, index) => (
                <Avatar key={index} size={size} className={className}>
                    {avatar.src && (
                        <AvatarImage
                            src={avatar.src}
                            alt={avatar.alt ?? avatar.fallback}
                        />
                    )}
                    <AvatarFallback>{avatar.fallback}</AvatarFallback>
                    {avatar.badge && (
                        <>
                            {avatar.badgeIcon ? (
                                <AvatarBadge>{avatar.badge}</AvatarBadge>
                            ) : (
                                <AvatarBadge className='bg-green-600 dark:bg-green-800' />
                            )}
                        </>
                    )}
                </Avatar>
            ))}

            {remainingCount > 0 && (
                <AvatarGroupCount className={countClassName}>
                    +{remainingCount}
                </AvatarGroupCount>
            )}
        </AvatarContainer>
    );
};

export default AvatarGroup;

