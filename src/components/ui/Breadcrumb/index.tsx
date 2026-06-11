'use client'

import type { FC } from 'react'
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
} from './components'
import type { BreadcrumbWrapperProps } from './breadcrumb.types'

const BreadcrumbWrapper: FC<BreadcrumbWrapperProps> = ({
    items,
    separator,
    ellipsis = false,
    maxItems = 3,
}) => {
    const shouldCollapse = ellipsis && items.length > maxItems
    const visibleItems = shouldCollapse
        ? [items[0], null, ...items.slice(-(maxItems - 1))]
        : items

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {visibleItems.map((item, index) => {
                    const isLast = index === visibleItems.length - 1

                    return (
                        <BreadcrumbItem key={index}>
                            {item === null ? (
                                <BreadcrumbEllipsis />
                            ) : isLast ? (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink href={item.href ?? '#'}>
                                    {item.label}
                                </BreadcrumbLink>
                            )}
                            {!isLast && (
                                <BreadcrumbSeparator>
                                    {separator}
                                </BreadcrumbSeparator>
                            )}
                        </BreadcrumbItem>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadcrumbWrapper

export {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
} from './components'
export type { BreadcrumbWrapperProps, BreadcrumbItemDef } from './breadcrumb.types'
