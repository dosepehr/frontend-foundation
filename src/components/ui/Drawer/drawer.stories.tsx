import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';
import DrawerWrapper, { DrawerClose } from '.';
import Button from '../Button';

const meta: Meta<typeof DrawerWrapper> = {
    title: 'UI/Drawer',
    component: DrawerWrapper,
    tags: ['autodocs'],
    argTypes: {
        direction: {
            control: 'radio',
            options: ['top', 'right', 'bottom', 'left'],
        },
        modal: { control: 'boolean' },
        showHandle: { control: 'boolean' },
        title: { control: 'text' },
        description: { control: 'text' },
    },
    parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof DrawerWrapper>;

export const Default: Story = {
    args: {
        trigger: <Button variant="outline" />,
        triggerChildren: 'Open',
        title: 'Are you absolutely sure?',
        description: 'This action cannot be undone.',
        footer: (
            <>
                <Button>Submit</Button>
                <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DrawerClose>
            </>
        ),
    },
};

// ─── Position ────────────────────────────────────────────────────────────

export const Sides: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            {(['top', 'right', 'bottom', 'left'] as const).map((direction) => (
                <DrawerWrapper
                    key={direction}
                    direction={direction}
                    trigger={<Button variant="outline" />}
                    triggerChildren={direction}
                    title={`Drawer from the ${direction}`}
                    description="Drag or press outside to dismiss."
                    footer={
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    }
                >
                    <p className="text-sm text-muted-foreground">
                        Content for the {direction} drawer.
                    </p>
                </DrawerWrapper>
            ))}
        </div>
    ),
};

// ─── Handle ──────────────────────────────────────────────────────────────

export const Handle: Story = {
    args: {
        showHandle: true,
        trigger: <Button variant="outline" />,
        triggerChildren: 'Open',
        title: 'Drag to dismiss',
        description: 'Use the handle to drag the drawer closed.',
    },
};

// ─── Non Modal ───────────────────────────────────────────────────────────

export const NonModal: Story = {
    args: {
        modal: false,
        trigger: <Button variant="outline" />,
        triggerChildren: 'Open non-modal',
        title: 'Non-modal drawer',
        description:
            'You can still interact with the rest of the page while this is open.',
    },
};

// ─── Snap Points ─────────────────────────────────────────────────────────

export const SnapPoints: Story = {
    render: () => {
        const [snapPoint, setSnapPoint] = React.useState<
            number | string | null
        >(0.5);

        return (
            <DrawerWrapper
                snapPoints={[0.25, 0.5, 1]}
                activeSnapPoint={snapPoint}
                setActiveSnapPoint={setSnapPoint}
                trigger={<Button variant="outline" />}
                triggerChildren="Open"
                title="Snap points"
                description="Drag the drawer between 25%, 50%, and full height."
                showHandle
            >
                <p className="text-sm text-muted-foreground">
                    Current snap point: {String(snapPoint)}
                </p>
            </DrawerWrapper>
        );
    },
};

// ─── Nested ──────────────────────────────────────────────────────────────

export const Nested: Story = {
    render: () => (
        <DrawerWrapper
            trigger={<Button variant="outline" />}
            triggerChildren="Open parent"
            title="Parent drawer"
            description="Open a nested drawer from here."
            footer={
                <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                </DrawerClose>
            }
        >
            <DrawerWrapper
                trigger={<Button>Open nested</Button>}
                title="Nested drawer"
                description="The parent drawer stays mounted behind this one."
                footer={
                    <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                }
            />
        </DrawerWrapper>
    ),
};

// ─── Custom Sizes ────────────────────────────────────────────────────────

export const CustomWidth: Story = {
    args: {
        direction: 'right',
        contentClassName: 'sm:max-w-md',
        trigger: <Button variant="outline" />,
        triggerChildren: 'Open',
        title: 'Custom width',
        description: 'DrawerContent uses a wider sm:max-w-md override.',
    },
};

// ─── No Header ───────────────────────────────────────────────────────────

export const CustomContent: Story = {
    args: {
        hideHeader: true,
        trigger: <Button variant="outline" />,
        triggerChildren: 'Open',
        children: (
            <div className="flex flex-col gap-2 p-4">
                <h2 className="text-base font-medium">Custom layout</h2>
                <p className="text-sm text-muted-foreground">
                    Skip the built-in header and lay out your own content.
                </p>
            </div>
        ),
    },
};
