'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon, SunMoonIcon } from 'lucide-react'
import Button from '@/src/components/ui/Button'

type Theme = 'light' | 'dark' | 'system'

const icons: Record<Theme, React.ReactNode> = {
    light: <SunIcon />,
    dark: <MoonIcon />,
    system: <SunMoonIcon />,
}

const next: Record<Theme, Theme> = {
    light: 'dark',
    dark: 'system',
    system: 'light',
}

export function ThemeChanger() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    if (!mounted) return <Button variant="ghost" size="icon" disabled><SunIcon /></Button>

    const current = (theme as Theme) ?? 'system'

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(next[current])}
            aria-label={`Switch to ${next[current]} theme`}
        >
            {icons[current]}
        </Button>
    )
}
