import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Separator from '.';

const meta: Meta<typeof Separator> = {
    title: 'UI/Separator',
    component: Separator,
    tags: ['autodocs'],
    argTypes: {
        orientation: {
            control: 'select',
            options: ['horizontal', 'vertical'],
            description: 'Direction of the divider',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Default: Story = {
    args: { orientation: 'horizontal' },
    decorators: [
        (Story) => (
            <div className="flex h-20 w-72 items-center justify-center">
                <Story />
            </div>
        ),
    ],
};

export const InContent: Story = {
    render: () => (
        <div className="w-72">
            <div className="space-y-1">
                <h4 className="text-sm font-medium">Frontend Foundation</h4>
                <p className="text-sm text-muted-foreground">
                    An open-source component library.
                </p>
            </div>
            <Separator className="my-4" />
            <div className="flex h-5 items-center gap-4 text-sm">
                <span>Docs</span>
                <Separator orientation="vertical" />
                <span>Components</span>
                <Separator orientation="vertical" />
                <span>Themes</span>
            </div>
        </div>
    ),
};
