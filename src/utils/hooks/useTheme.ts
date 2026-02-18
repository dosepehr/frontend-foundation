import { useContext } from 'react';
import { ThemeProviderContext } from '../context/ThemeProvider';

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);
    if (!context) {
        console.error('useTheme must be used within ThemeProvider');
    }
    return context;
};

