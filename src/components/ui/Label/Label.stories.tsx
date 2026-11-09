import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Label from '.';

const meta: Meta<typeof Label> = {
    title: 'UI/Label',
    component: Label,
    tags: ['autodocs'],
    argTypes: {
        children: { control: 'text', description: 'Label text' },
        required: {
            control: 'boolean',
            description: 'Shows the required marker',
        },
        disabled: {
            control: 'boolean',
            description: 'Dims the label for a disabled control',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
    args: { children: 'Email address', required: false, disabled: false },
};

export const WithInput: Story = {
    render: () => (
        <div className="flex w-72 flex-col gap-2">
            <Label htmlFor="label-email" required>
                Email address
            </Label>
            <input
                id="label-email"
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                placeholder="Enter the email address"
            />
        </div>
    ),
};
