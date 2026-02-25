import {
    ArrowRightCircle,
    Download,
    Info,
    Mail,
    MinusIcon,
    PlusIcon,
    Trash2,
} from 'lucide-react';
import { Button } from '.';
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ButtonGroup, ButtonGroupSeparator } from '../ButtonGroup';

const meta = {
    title: 'COMPONENTS/Button',
    component: Button,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: [
                'default',
                'secondary',
                'success',
                'info',
                'destructive',
                'outline',
                'ghost',
                'link',
            ],
            description: 'Visual style variant of the button',
        },
        size: {
            control: 'select',
            options: [
                'default',
                'xs',
                'sm',
                'lg',
                'icon',
                'icon-xs',
                'icon-sm',
                'icon-lg',
            ],
            description: 'Size of the button',
        },
        disabled: {
            control: 'boolean',
            description: 'Whether the button is disabled',
        },
        isLoading: {
            control: 'boolean',
            description: 'Shows a loading spinner and optionally replaces the label',
        },
        showArrow: {
            control: 'boolean',
            description: 'Appends a directional arrow icon to the button',
        },
        loadingText: {
            control: 'text',
            description: 'Text displayed while the button is in loading state',
        },
        asChild: {
            control: 'boolean',
            description: 'Renders the button as its child element using Radix Slot',
        },
        children: {
            control: 'text',
            description: 'Button label or content',
        },
    },
    args: {
        children: 'Button',
        disabled: false,
        isLoading: false,
        showArrow: false,
        loadingText: 'Loading...',
        asChild: false,
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: { variant: 'default', size: 'default', children: 'Click me' },
};

export const AllVariants: Story = {
    render: () => {
        const variants = [
            'default',
            'secondary',
            'success',
            'info',
            'destructive',
            'outline',
            'ghost',
            'link',
        ] as const;

        return (
            <div className='flex items-center gap-2 flex-wrap'>
                {variants.map((v) => (
                    <Button key={v} variant={v} size='default'>
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                    </Button>
                ))}
            </div>
        );
    },
};

export const AllSizes: Story = {
    render: () => {
        const sizes = [
            'xs',
            'sm',
            'default',
            'lg',
            'icon-xs',
            'icon-sm',
            'icon',
            'icon-lg',
        ] as const;

        return (
            <div className='flex items-center gap-2 flex-wrap'>
                {sizes.map((s) => (
                    <Button key={s} variant='outline' size={s}>
                        {s.startsWith('icon') ? <ArrowRightCircle /> : s}
                    </Button>
                ))}
            </div>
        );
    },
};

export const IconSizes: Story = {
    render: () => (
        <div className='flex flex-wrap items-end gap-3'>
            {(['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const).map((s) => (
                <Button key={s} size={s} aria-label={s}>
                    <Download />
                </Button>
            ))}
        </div>
    ),
};

export const WithIcons: Story = {
    render: () => (
        <div className='flex flex-wrap items-center gap-3'>
            <Button>
                <Mail />
                Leading icon
            </Button>
            <Button variant='outline'>
                Trailing icon
                <Download />
            </Button>
            <Button variant='secondary'>
                <Trash2 />
                Both sides
                <Download />
            </Button>
            <Button variant='success'>
                <Info />
                Success action
            </Button>
            <Button variant='info'>
                <Info />
                Info action
            </Button>
        </div>
    ),
};

export const WithArrow: Story = {
    render: () => (
        <div className='flex flex-wrap items-center gap-3'>
            <Button showArrow>Continue</Button>
            <Button variant='outline' showArrow>
                Learn more
            </Button>
            <Button variant='ghost' showArrow>
                See all
            </Button>
            <Button variant='success' showArrow>
                Confirm
            </Button>
            <Button variant='info' showArrow>
                Details
            </Button>
        </div>
    ),
};

export const States: Story = {
    render: () => (
        <div className='flex flex-wrap items-center gap-3'>
            <Button disabled>Disabled</Button>
            <Button variant='outline' disabled>
                Disabled outline
            </Button>
            <Button isLoading>Save</Button>
            <Button isLoading loadingText='Uploading…' variant='secondary'>
                Upload
            </Button>
            <Button isLoading size='icon' aria-label='Loading' loadingText='' />
            <Button variant='success' isLoading loadingText='Processing…'>
                Submit
            </Button>
        </div>
    ),
};

export const Grouped: Story = {
    render: () => (
        <ButtonGroup>
            <Button>Button 1</Button>
            <Button>Button 2</Button>
        </ButtonGroup>
    ),
};

export const GroupedVertical: Story = {
    render: () => (
        <ButtonGroup orientation='vertical'>
            <Button variant='outline' size='icon'>
                <PlusIcon />
            </Button>
            <Button variant='outline' size='icon'>
                <MinusIcon />
            </Button>
        </ButtonGroup>
    ),
};

export const GroupedWithSeparator: Story = {
    render: () => (
        <ButtonGroup>
            <Button>Button 1</Button>
            <ButtonGroupSeparator />
            <Button>Button 2</Button>
        </ButtonGroup>
    ),
};
