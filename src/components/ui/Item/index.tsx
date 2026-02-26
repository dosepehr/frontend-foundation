import { FC } from 'react';
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemHeader,
    ItemMedia,
    ItemTitle,
} from './item';
import { ItemProps } from './item.type';


const ItemGroup: FC<ItemProps> = ({
    title,
    description,
    media,
    mediaVariant = 'default',
    actions,
    header,
    footer,
    children,
    variant = 'default',
    size = 'default',
}) => {
    return (
        <Item variant={variant} size={size}>
            {header && <ItemHeader>{header}</ItemHeader>}

            {media && <ItemMedia variant={mediaVariant}>{media}</ItemMedia>}

            {(title || description) && (
                <ItemContent>
                    {title && <ItemTitle>{title}</ItemTitle>}
                    {description && (
                        <ItemDescription>{description}</ItemDescription>
                    )}
                </ItemContent>
            )}

            {children}

            {actions && <ItemActions>{actions}</ItemActions>}

            {footer && <ItemFooter>{footer}</ItemFooter>}
        </Item>
    );
};

export default ItemGroup;

