import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ScrollArea, { ScrollBar } from '.';

const meta: Meta<typeof ScrollArea> = {
    title: 'UI/ScrollArea',
    component: ScrollArea,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

const tags = Array.from({ length: 40 }, (_, i) => `v1.2.0-beta.${40 - i}`);

export const Vertical: Story = {
    render: () => (
        <ScrollArea className="h-72 w-48 rounded-md border">
            <div className="p-4">
                <h4 className="mb-4 text-sm font-medium">Tags</h4>
                {tags.map((tag) => (
                    <div
                        key={tag}
                        className="border-b py-2 text-sm last:border-0"
                    >
                        {tag}
                    </div>
                ))}
            </div>
        </ScrollArea>
    ),
};

export const Horizontal: Story = {
    render: () => (
        <ScrollArea className="w-96 rounded-md border whitespace-nowrap">
            <div className="flex w-max gap-4 p-4">
                {Array.from({ length: 12 }, (_, i) => (
                    <div
                        key={i}
                        className="flex size-28 items-center justify-center rounded-md bg-muted text-sm"
                    >
                        Item {i + 1}
                    </div>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    ),
};
