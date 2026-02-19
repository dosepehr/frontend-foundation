import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as Icons from '../components/_icons';
import { cn } from '@/utils/funcs/cn';

const DEFAULT_COLOR = 'DEFAULT';

const meta: Meta = {
    title: 'tokens/Icon Pack',
    argTypes: {
        color: {
            control: 'color',
            description:
                'Fill/Stroke color of the icon (default uses text-primary)',
        },
        width: {
            control: { type: 'number', min: 12, max: 200, step: 2 },
            description: 'Width of the icon',
        },
        height: {
            control: { type: 'number', min: 12, max: 200, step: 2 },
            description: 'Height of the icon',
        },
        strokeWidth: {
            control: { type: 'number', min: 0.5, max: 5, step: 0.1 },
            description: 'Stroke width of the icon',
        },
        className: {
            control: 'text',
            description: 'Custom Tailwind / CSS class',
        },
    },
    args: {
        color: DEFAULT_COLOR,
        width: 40,
        height: 40,
        strokeWidth: 1,
        className: '',
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const IconPack: Story = {
    render: (args) => {
        const isDefault = args.color === DEFAULT_COLOR;

        const iconStyle = isDefault ? {} : { color: args.color };

        const iconClass = cn(isDefault ? 'text-primary' : '', args.className);

        return (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 p-6'>
                {Object.entries(Icons).map(([name, Icon]) => (
                    <div
                        key={name}
                        className='flex flex-col items-center justify-center space-y-2 p-4 rounded-lg bg-secondary shadow'
                    >
                        <Icon
                            style={iconStyle}
                            width={args.width}
                            height={args.height}
                            strokeWidth={args.strokeWidth}
                            className={iconClass}
                        />
                        <span className='text-sm text-secondary-foreground truncate'>
                            {name}
                        </span>
                    </div>
                ))}
            </div>
        );
    },
};

