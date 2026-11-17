import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import ColorPicker from '.';

const meta: Meta<typeof ColorPicker> = {
    title: 'UI/ColorPicker',
    component: ColorPicker,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className="w-72">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        label: { control: 'text' },
        description: { control: 'text' },
        error: { control: 'text' },
        showRgb: { control: 'boolean' },
        showEyeDropper: { control: 'boolean' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
    },
    args: { label: 'Color', defaultValue: '#3b82f6' },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const body = within(canvasElement.ownerDocument.body);
        await userEvent.click(canvas.getByRole('button', { expanded: false }));
        const content = await body.findByRole('slider', { name: 'Hue' });
        // Wait for the open animation to finish.
        await waitFor(() => expect(content).toBeVisible());
    },
};

export const HexOnly: Story = {
    args: { showRgb: false },
};

export const CustomPresets: Story = {
    args: {
        label: 'Brand color',
        description: 'Pick one of the brand colors or any other.',
        presets: [
            '#0f172a',
            '#1e40af',
            '#0891b2',
            '#059669',
            '#ca8a04',
            '#dc2626',
            '#db2777',
            '#7c3aed',
        ],
    },
};

export const WithoutPresets: Story = {
    args: { presets: [] },
};

export const WithoutEyeDropper: Story = {
    args: {
        showEyeDropper: false,
        description:
            'The eyedropper only shows in browsers that support it (Chromium).',
    },
};

export const Invalid: Story = {
    args: {
        error: 'This color is too light for text.',
        defaultValue: '#fef9c3',
    },
};

export const Disabled: Story = {
    args: { disabled: true },
};

const ControlledDemo = () => {
    const [color, setColor] = useState('#ec4899');
    return (
        <div className="flex flex-col gap-3">
            <ColorPicker
                label="Accent"
                value={color}
                onValueChange={setColor}
            />
            <div
                aria-hidden
                className="h-16 rounded-md"
                style={{ backgroundColor: color }}
            />
            <p className="text-sm text-muted-foreground">
                Value: <code>{color}</code>
            </p>
        </div>
    );
};

export const Controlled: Story = {
    render: () => <ControlledDemo />,
};

export const RightToLeft: Story = {
    // Persian page: lang sets the Estedad font, dir the direction (also for portals).
    globals: { i18n: 'fa-IR' },
    render: (args) => (
        <div dir="rtl">
            <ColorPicker {...args} />
        </div>
    ),
    args: { label: 'رنگ', defaultValue: '#14b8a6' },
};
