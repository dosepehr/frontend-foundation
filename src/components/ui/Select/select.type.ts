import type { ReactNode } from 'react'

export type SelectOption = {
    value: string
    label: string
    disabled?: boolean
}

export type SelectWrapperProps = {
    label?: string
    description?: string
    error?: string
    required?: boolean
    placeholder?: string
    options?: SelectOption[]
    value?: string
    onValueChange?: (value: string) => void
    disabled?: boolean
    isLoading?: boolean
    isError?: boolean
    className?: string
    triggerClassName?: string
    startAddon?: ReactNode
}
