import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ThemeChanger from '.';

const meta: Meta<typeof ThemeChanger> = {
    title: 'UI/ThemeChanger',
    component: ThemeChanger,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ThemeChanger>;

export const Default: Story = {};
