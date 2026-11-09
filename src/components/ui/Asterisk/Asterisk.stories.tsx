import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Asterisk from '.';

const meta: Meta<typeof Asterisk> = {
    title: 'UI/Asterisk',
    component: Asterisk,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Asterisk>;

export const Default: Story = {};

export const NextToALabel: Story = {
    render: () => (
        <span className="text-sm font-medium">
            Email <Asterisk />
        </span>
    ),
};
