import type { Meta } from '@storybook/nextjs-vite';
import * as Icons from '../../src/components/_icons';

const meta: Meta = {
    title: 'tokens/Icons',
    parameters: { layout: 'fullscreen' },
    tags: ['!dev'],
};

export default meta;

export const Page = {
    render: () => (
        <div className='p-8 flex flex-col gap-8'>
            <div>
                <h1 className='text-2xl font-semibold tracking-tight mb-1'>Icons</h1>
                <p className='text-sm text-muted-foreground'>Custom icon set used across the design system.</p>
            </div>

            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4'>
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

            <div className='flex flex-col gap-4'>
                <h2 className='text-lg font-semibold tracking-tight'>Sizes</h2>
                <div className='flex items-end gap-6'>
                    {[4, 5, 6, 8, 10, 12].map((size) => {
                        const [, Icon] = Object.entries(Icons)[0]
                        return (
                            <div key={size} className='flex flex-col items-center gap-2'>
                                <Icon className={`size-${size} text-foreground`} />
                                <span className='text-xs text-muted-foreground'>{size * 4}px</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className='flex flex-col gap-4'>
                <h2 className='text-lg font-semibold tracking-tight'>Colors</h2>
                <div className='flex flex-wrap gap-4'>
                    {[
                        { label: 'foreground', className: 'text-foreground' },
                        { label: 'muted-foreground', className: 'text-muted-foreground' },
                        { label: 'primary', className: 'text-primary' },
                        { label: 'destructive', className: 'text-destructive' },
                        { label: 'success', className: 'text-success' },
                        { label: 'warning', className: 'text-warning' },
                    ].map(({ label, className }) => {
                        const [, Icon] = Object.entries(Icons)[0]
                        return (
                            <div key={label} className='flex flex-col items-center gap-2'>
                                <Icon className={`size-6 ${className}`} />
                                <span className='text-xs text-muted-foreground'>{label}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    ),
};
