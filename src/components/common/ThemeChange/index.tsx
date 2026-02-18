'use client';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/utils/hooks/useTheme';

const ThemeChange = () => {
    const { appliedTheme, toggleTheme } = useTheme();

    return (
        <header className=''>
            <Button onClick={toggleTheme} variant='secondary' size='sm'>
                {appliedTheme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </Button>
        </header>
    );
};

export default ThemeChange;

