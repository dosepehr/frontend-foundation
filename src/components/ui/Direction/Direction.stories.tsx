import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DirectionProvider, useDirection } from '.';
import Button from '../Button';

const DirectionDemo = () => {
    const dir = useDirection();
    return (
        <div
            dir={dir}
            className="flex w-80 flex-col gap-3 rounded-lg border p-4"
        >
            <p className="text-sm">
                Current direction: <code>{dir}</code>
            </p>
            <div className="flex gap-2">
                <Button>{dir === 'rtl' ? 'ذخیره' : 'Save'}</Button>
                <Button variant="outline">
                    {dir === 'rtl' ? 'انصراف' : 'Cancel'}
                </Button>
            </div>
        </div>
    );
};

const meta: Meta<typeof DirectionProvider> = {
    title: 'UI/Direction',
    component: DirectionProvider,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DirectionProvider>;

export const RightToLeft: Story = {
    render: () => (
        <DirectionProvider dir="rtl">
            <DirectionDemo />
        </DirectionProvider>
    ),
};

export const LeftToRight: Story = {
    render: () => (
        <DirectionProvider dir="ltr">
            <DirectionDemo />
        </DirectionProvider>
    ),
};
