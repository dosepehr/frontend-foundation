import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Progress } from './components';

const meta: Meta<typeof Progress> = {
    title: 'UI/Progress',
    component: Progress,
    tags: ['autodocs'],
    argTypes: {
        value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
        variant: {
            control: 'select',
            options: ['default', 'success', 'warning', 'destructive', 'info'],
        },
    },
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
    args: { value: 60 },
};

export const Success: Story = {
    args: { value: 100, variant: 'success' },
};

export const Warning: Story = {
    args: { value: 45, variant: 'warning' },
};

export const Destructive: Story = {
    args: { value: 20, variant: 'destructive' },
};

export const Info: Story = {
    args: { value: 70, variant: 'info' },
};

export const Empty: Story = {
    args: { value: 0 },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <Progress value={60} variant="default" />
            <Progress value={100} variant="success" />
            <Progress value={45} variant="warning" />
            <Progress value={20} variant="destructive" />
            <Progress value={70} variant="info" />
        </div>
    ),
};
