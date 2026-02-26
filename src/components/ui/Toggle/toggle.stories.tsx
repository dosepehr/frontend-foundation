import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Bold, Italic, BookmarkIcon } from 'lucide-react';
import { Toggle } from '.';

const meta: Meta<typeof Toggle> = {
    title: 'Components/Toggle',
    component: Toggle,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'A two-state button that can be toggled on or off. Built on Radix UI Toggle primitive. Supports `default` and `outline` variants in three sizes.',
            },
        },
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'outline'],
            description: 'Visual style of the toggle.',
        },
        size: {
            control: 'select',
            options: ['sm', 'default', 'lg'],
            description: 'Size of the toggle button.',
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the toggle.',
        },
        pressed: {
            control: 'boolean',
            description: 'Controlled pressed state.',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
    args: {
        variant: 'default',
        size: 'default',
        children: <Bold />,
        'aria-label': 'Toggle bold',
    },
};

export const WithText: Story = {
    parameters: {
        docs: {
            description: { story: 'Toggle can contain both an icon and text.' },
        },
    },
    args: {
        variant: 'outline',
        children: (
            <>
                <BookmarkIcon className='group-data-[state=on]/toggle:fill-foreground' />
                Bookmark
            </>
        ),
        'aria-label': 'Toggle bookmark',
    },
};

export const Pressed: Story = {
    name: 'Pressed (Controlled)',
    parameters: {
        docs: {
            description: {
                story: 'Render the toggle in a pressed state using the `pressed` prop.',
            },
        },
    },
    args: {
        pressed: true,
        variant: 'outline',
        children: <Bold />,
        'aria-label': 'Toggle bold',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        variant: 'outline',
        children: <Bold />,
        'aria-label': 'Toggle bold',
    },
};

export const Sizes: Story = {
    parameters: {
        docs: {
            description: {
                story: 'All three sizes: `sm`, `default`, and `lg`.',
            },
        },
    },
    render: () => (
        <div className='flex items-center gap-3'>
            <Toggle size='sm' variant='outline' aria-label='small'>
                <Bold />
            </Toggle>
            <Toggle size='default' variant='outline' aria-label='default'>
                <Bold />
            </Toggle>
            <Toggle size='lg' variant='outline' aria-label='large'>
                <Bold />
            </Toggle>
        </div>
    ),
};

export const Variants: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Side-by-side comparison of `default` and `outline` variants.',
            },
        },
    },
    render: () => (
        <div className='flex items-center gap-3'>
            <Toggle variant='default' aria-label='default variant'>
                <Italic />
            </Toggle>
            <Toggle variant='outline' aria-label='outline variant'>
                <Italic />
            </Toggle>
        </div>
    ),
};

