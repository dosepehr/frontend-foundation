import type { Meta } from '@storybook/nextjs-vite';
import * as Icons from '../../src/components/_icons';

const meta: Meta = {
    title: 'tokens/Icons',
    parameters: { layout: 'fullscreen' },
    tags: ['!dev'],
};

export default meta;

const FirstIcon = Object.values(Icons)[0];

const SIZES = [
    { label: '16px', cls: 'size-4' },
    { label: '20px', cls: 'size-5' },
    { label: '24px', cls: 'size-6' },
    { label: '32px', cls: 'size-8' },
    { label: '40px', cls: 'size-10' },
    { label: '48px', cls: 'size-12' },
];

const COLORS = [
    { label: 'foreground', cls: 'text-foreground' },
    { label: 'muted-foreground', cls: 'text-muted-foreground' },
    { label: 'primary', cls: 'text-primary' },
    { label: 'destructive', cls: 'text-destructive' },
    { label: 'success', cls: 'text-success' },
    { label: 'warning', cls: 'text-warning' },
];

export const IconsPage = () => (
    <div className='p-8 flex flex-col gap-10'>
        <div>
            <h1 className='text-2xl font-semibold tracking-tight mb-1'>Icons</h1>
            <p className='text-sm text-muted-foreground'>Custom icon set used across the design system.</p>
        </div>

        <div className='flex flex-col gap-3'>
            <h2 className='text-lg font-semibold tracking-tight'>Icon Pack</h2>
            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3'>
                {Object.entries(Icons).map(([name, Icon]) => (
                    <div
                        key={name}
                        className='flex flex-col items-center gap-2 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors'
                    >
                        <Icon className='size-6 text-foreground' />
                        <span className='text-xs text-muted-foreground text-center leading-tight break-all'>
                            {name}
                        </span>
                    </div>
                ))}
            </div>
        </div>

        <div className='flex flex-col gap-3'>
            <h2 className='text-lg font-semibold tracking-tight'>Sizes</h2>
            <div className='flex items-end gap-8'>
                {SIZES.map(({ label, cls }) => (
                    <div key={label} className='flex flex-col items-center gap-2'>
                        <FirstIcon className={`${cls} text-foreground`} />
                        <span className='text-xs text-muted-foreground'>{label}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className='flex flex-col gap-3'>
            <h2 className='text-lg font-semibold tracking-tight'>Colors</h2>
            <div className='flex flex-wrap gap-6'>
                {COLORS.map(({ label, cls }) => (
                    <div key={label} className='flex flex-col items-center gap-2'>
                        <FirstIcon className={`size-6 ${cls}`} />
                        <span className='text-xs text-muted-foreground'>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
