'use client'

import * as React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal,
    DropdownMenuTrigger,
} from './dropdown-menu'
import { cn } from '@/src/utils/funcs/cn'
import type {
    DropdownMenuWrapperProps,
    DropdownGroup,
    DropdownItem,
} from './dropdown-menu.types'

function RenderItem({ item }: { item: DropdownItem }) {
    if (item.type === 'radio-group') {
        return (
            <DropdownMenuRadioGroup value={item.value} onValueChange={item.onValueChange}>
                {item.items.map((radio) => (
                    <DropdownMenuRadioItem key={radio.label} value={radio.label}>
                        {radio.icon}
                        {radio.label}
                    </DropdownMenuRadioItem>
                ))}
            </DropdownMenuRadioGroup>
        )
    }

    if (item.type === 'checkbox') {
        return (
            <DropdownMenuCheckboxItem
                checked={item.checked}
                onCheckedChange={item.onCheckedChange}
                disabled={item.disabled}
            >
                {item.icon}
                {item.label}
            </DropdownMenuCheckboxItem>
        )
    }

    if (item.type === 'sub') {
        return (
            <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={item.disabled}>
                    {item.icon}
                    {item.label}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                        <RenderGroups groups={item.items as DropdownGroup[]} />
                    </DropdownMenuSubContent>
                </DropdownMenuPortal>
            </DropdownMenuSub>
        )
    }

    return (
        <DropdownMenuItem
            variant={item.variant}
            disabled={item.disabled}
            onClick={item.onClick}
        >
            {item.icon}
            {item.label}
            {item.shortcut && <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>}
        </DropdownMenuItem>
    )
}

function RenderGroups({ groups }: { groups: DropdownGroup[] }) {
    return (
        <>
            {groups.map((group, gi) => (
                <React.Fragment key={gi}>
                    {gi > 0 && <DropdownMenuSeparator />}
                    <DropdownMenuGroup>
                        {group.label && <DropdownMenuLabel>{group.label}</DropdownMenuLabel>}
                        {group.items.map((item, ii) => (
                            <RenderItem key={ii} item={item} />
                        ))}
                    </DropdownMenuGroup>
                </React.Fragment>
            ))}
        </>
    )
}

function DropdownMenuWrapper({
    trigger,
    groups,
    contentClassName,
    align = 'start',
    side = 'bottom',
}: DropdownMenuWrapperProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
            <DropdownMenuContent
                align={align}
                side={side}
                className={cn('w-48', contentClassName)}
            >
                <RenderGroups groups={groups} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropdownMenuWrapper

export {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from './dropdown-menu'
export type { DropdownMenuWrapperProps, DropdownGroup, DropdownItem } from './dropdown-menu.types'
