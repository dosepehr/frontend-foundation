import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from './components';

const meta: Meta<typeof ResizablePanelGroup> = {
    title: 'UI/Resizable',
    component: ResizablePanelGroup,
    tags: ['autodocs'],
    argTypes: {
        orientation: {
            control: 'radio',
            options: ['horizontal', 'vertical'],
        },
    },
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className="h-80 w-full max-w-md rounded-lg border">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof ResizablePanelGroup>;

export const Default: Story = {
    render: () => (
        <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel>
                <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">One</span>
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
                <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Two</span>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    ),
};

// ─── Vertical ────────────────────────────────────────────────────────────

export const Vertical: Story = {
    render: () => (
        <ResizablePanelGroup orientation="vertical">
            <ResizablePanel>
                <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Header</span>
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
                <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Content</span>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    ),
};

// ─── Handle ──────────────────────────────────────────────────────────────

export const WithHandle: Story = {
    render: () => (
        <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel>
                <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Sidebar</span>
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
                <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Content</span>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    ),
};

// ─── Nested ──────────────────────────────────────────────────────────────

export const Nested: Story = {
    render: () => (
        <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize="25%" minSize="15%">
                <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Sidebar</span>
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="75%">
                <ResizablePanelGroup orientation="vertical">
                    <ResizablePanel defaultSize="65%">
                        <div className="flex h-full items-center justify-center p-6">
                            <span className="font-semibold">Editor</span>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize="35%">
                        <div className="flex h-full items-center justify-center p-6">
                            <span className="font-semibold">Terminal</span>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    ),
};

// ─── Min/Max Size and Collapsible ────────────────────────────────────────

export const CollapsiblePanel: Story = {
    render: () => (
        <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel
                defaultSize="25%"
                minSize="10%"
                maxSize="40%"
                collapsible
                collapsedSize="0%"
            >
                <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Collapsible</span>
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
                <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Content</span>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    ),
};
