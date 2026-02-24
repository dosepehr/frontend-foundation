import * as React from 'react';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
} from './components';
import { BreadcrumbGroupProps, BreadcrumbItemDef } from './breadcrumb.props';

const BreadcrumbGroup = ({
    items,
    maxItems,
    separator,
    ...props
}: BreadcrumbGroupProps) => {
    const shouldCollapse = maxItems !== undefined && items.length > maxItems;

    const buildVisible = (): Array<BreadcrumbItemDef | null> => {
        if (!shouldCollapse) return items;

        const firstCount = 1;
        const lastCount = maxItems! - firstCount - 1;

        const first = items.slice(0, firstCount);
        const last = items.slice(items.length - lastCount);

        return [...first, null, ...last];
    };

    const visible = buildVisible();

    return (
        <Breadcrumb {...props}>
            <BreadcrumbList>
                {visible.map((item, index) => {
                    const isLast = index === visible.length - 1;
                    const isEllipsis = item === null;

                    return (
                        <React.Fragment key={index}>
                            <BreadcrumbItem>
                                {isEllipsis ? (
                                    <BreadcrumbEllipsis />
                                ) : isLast ? (
                                    <BreadcrumbPage className='inline-flex items-center gap-1.5'>
                                        {item.icon && (
                                            <item.icon className='size-3.5' />
                                        )}
                                        {item.label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink
                                        href={item.href ?? '#'}
                                        className='inline-flex items-center gap-1.5'
                                    >
                                        {item.icon && (
                                            <item.icon className='size-3.5' />
                                        )}
                                        {item.label}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>

                            {!isLast && (
                                <BreadcrumbSeparator>
                                    {separator}
                                </BreadcrumbSeparator>
                            )}
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default BreadcrumbGroup;
