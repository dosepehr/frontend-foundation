import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Slider } from '.';

const meta: Meta<typeof Slider> = {
    title: 'Components/Slider',
    component: Slider,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'A customizable slider component built on Radix UI. Supports single thumb, range (dual thumb), vertical orientation, and controlled/uncontrolled modes.',
            },
        },
    },
    argTypes: {
        min: { control: 'number', description: 'Minimum value.' },
        max: { control: 'number', description: 'Maximum value.' },
        step: { control: 'number', description: 'Step increment.' },
        disabled: { control: 'boolean', description: 'Disables the slider.' },
        orientation: {
            control: 'select',
            options: ['horizontal', 'vertical'],
            description: 'Orientation of the slider.',
        },
    },
    decorators: [
        (Story, context) =>
            context.args.orientation === 'vertical' ? (
                <div className='flex h-48 items-center justify-center'>
                    <Story />
                </div>
            ) : (
                <div className='w-80'>
                    <Story />
                </div>
            ),
    ],
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
    args: {
        defaultValue: [40],
        min: 0,
        max: 100,
        step: 1,
    },
};

export const Range: Story = {
    name: 'Range (Dual Thumb)',
    parameters: {
        docs: {
            description: {
                story: 'Pass two values to `defaultValue` to render a range slider with two thumbs.',
            },
        },
    },
    args: {
        defaultValue: [20, 70],
        min: 0,
        max: 100,
        step: 1,
    },
};

export const WithStep: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Slider snaps to increments defined by `step`.',
            },
        },
    },
    args: {
        defaultValue: [40],
        min: 0,
        max: 100,
        step: 10,
    },
};

export const Vertical: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set `orientation="vertical"` to render the slider vertically.',
            },
        },
    },
    args: {
        defaultValue: [50],
        orientation: 'vertical',
        min: 0,
        max: 100,
    },
};

export const VerticalRange: Story = {
    args: {
        defaultValue: [20, 80],
        orientation: 'vertical',
        min: 0,
        max: 100,
    },
};

export const Disabled: Story = {
    args: {
        defaultValue: [60],
        disabled: true,
    },
};

export const MinMax: Story = {
    name: 'Custom Min / Max',
    parameters: {
        docs: {
            description: {
                story: 'Slider constrained between 50 and 200.',
            },
        },
    },
    args: {
        defaultValue: [100],
        min: 50,
        max: 200,
        step: 5,
    },
};

