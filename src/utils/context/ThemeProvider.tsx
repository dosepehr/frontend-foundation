'use client';
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    appliedTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

const initialThemeState: ThemeProviderState = {
    theme: 'system',
    appliedTheme: 'light',
    setTheme: () => null,
    toggleTheme: () => null,
};

export const ThemeProviderContext =
    createContext<ThemeProviderState>(initialThemeState);

const resolveAppliedTheme = (t: Theme): 'light' | 'dark' => {
    if (typeof window == 'undefined') {
        return 'dark';
    }
    if (t === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    }
    return t;
};

export function ThemeProvider({
    children,
    defaultTheme = 'system',
    storageKey = 'vite-ui-theme',
    ...props
}: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window === 'undefined') return defaultTheme;
        return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    });

    const appliedTheme = useMemo(() => resolveAppliedTheme(theme), [theme]);

    useEffect(() => {
        const root = document.documentElement;
        if (appliedTheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [appliedTheme]);

    useEffect(() => {
        if (theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            const root = document.documentElement;
            if (e.matches) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        localStorage.setItem(storageKey, newTheme);
        setThemeState(newTheme);
    };

    const toggleTheme = () => {
        const next = appliedTheme === 'dark' ? 'light' : 'dark';
        setTheme(next);
    };

    const value: ThemeProviderState = {
        theme,
        appliedTheme,
        setTheme,
        toggleTheme,
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

