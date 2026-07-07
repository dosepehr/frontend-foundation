import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import DrawerWrapper from '.';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from './components';

describe('Drawer primitives', () => {
    it('renders the trigger', () => {
        render(
            <Drawer>
                <DrawerTrigger>Open</DrawerTrigger>
            </Drawer>,
        );
        expect(screen.getByText('Open')).toBeInTheDocument();
    });

    it('content is not in the document by default', () => {
        render(
            <Drawer>
                <DrawerTrigger>Open</DrawerTrigger>
                <DrawerContent>
                    <DrawerTitle>My Drawer</DrawerTitle>
                </DrawerContent>
            </Drawer>,
        );
        expect(screen.queryByText('My Drawer')).not.toBeInTheDocument();
    });

    it('content is visible when open is true', () => {
        render(
            <Drawer open>
                <DrawerContent>
                    <DrawerTitle>My Drawer</DrawerTitle>
                </DrawerContent>
            </Drawer>,
        );
        expect(screen.getByText('My Drawer')).toBeInTheDocument();
    });

    it('opens on trigger click', async () => {
        const user = userEvent.setup();
        render(
            <Drawer>
                <DrawerTrigger>Open</DrawerTrigger>
                <DrawerContent>
                    <DrawerTitle>My Drawer</DrawerTitle>
                </DrawerContent>
            </Drawer>,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByText('My Drawer')).toBeInTheDocument();
    });

    it('calls onOpenChange when trigger is clicked', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        render(
            <Drawer onOpenChange={onOpenChange}>
                <DrawerTrigger>Open</DrawerTrigger>
                <DrawerContent>
                    <DrawerTitle>T</DrawerTitle>
                </DrawerContent>
            </Drawer>,
        );
        await user.click(screen.getByText('Open'));
        expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('closes when DrawerClose is clicked', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        render(
            <Drawer open onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerTitle>T</DrawerTitle>
                    <DrawerClose>Close</DrawerClose>
                </DrawerContent>
            </Drawer>,
        );
        await user.click(screen.getByText('Close'));
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('renders title inside DrawerHeader', () => {
        render(
            <Drawer open>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Title text</DrawerTitle>
                    </DrawerHeader>
                </DrawerContent>
            </Drawer>,
        );
        expect(screen.getByText('Title text')).toBeInTheDocument();
    });

    it('renders description inside DrawerHeader', () => {
        render(
            <Drawer open>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>T</DrawerTitle>
                        <DrawerDescription>Desc text</DrawerDescription>
                    </DrawerHeader>
                </DrawerContent>
            </Drawer>,
        );
        expect(screen.getByText('Desc text')).toBeInTheDocument();
    });

    it('renders footer content', () => {
        render(
            <Drawer open>
                <DrawerContent>
                    <DrawerTitle>T</DrawerTitle>
                    <DrawerFooter>Footer content</DrawerFooter>
                </DrawerContent>
            </Drawer>,
        );
        expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('renders data-slot="drawer-content" on the content', () => {
        render(
            <Drawer open>
                <DrawerContent>
                    <DrawerTitle>T</DrawerTitle>
                </DrawerContent>
            </Drawer>,
        );
        expect(
            document.querySelector('[data-slot="drawer-content"]'),
        ).toBeInTheDocument();
    });

    it('defaults direction to bottom', () => {
        render(
            <Drawer open>
                <DrawerContent>
                    <DrawerTitle>T</DrawerTitle>
                </DrawerContent>
            </Drawer>,
        );
        expect(
            document.querySelector('[data-vaul-drawer-direction="bottom"]'),
        ).toBeInTheDocument();
    });

    it.each(['top', 'right', 'bottom', 'left'] as const)(
        'accepts direction="%s"',
        (direction) => {
            render(
                <Drawer open direction={direction}>
                    <DrawerContent>
                        <DrawerTitle>T</DrawerTitle>
                    </DrawerContent>
                </Drawer>,
            );
            expect(
                document.querySelector(
                    `[data-vaul-drawer-direction="${direction}"]`,
                ),
            ).toBeInTheDocument();
        },
    );

    it('does not render a handle by default', () => {
        render(
            <Drawer open>
                <DrawerContent>
                    <DrawerTitle>T</DrawerTitle>
                </DrawerContent>
            </Drawer>,
        );
        expect(
            document.querySelector('[data-slot="drawer-handle"]'),
        ).not.toBeInTheDocument();
    });

    it('renders a handle when showHandle is true', () => {
        render(
            <Drawer open>
                <DrawerContent showHandle>
                    <DrawerTitle>T</DrawerTitle>
                </DrawerContent>
            </Drawer>,
        );
        expect(
            document.querySelector('[data-slot="drawer-handle"]'),
        ).toBeInTheDocument();
    });
});

describe('DrawerWrapper', () => {
    it('renders the trigger', () => {
        render(
            <DrawerWrapper
                trigger={<button type="button" />}
                triggerChildren="Open"
                title="My Drawer"
            >
                Content
            </DrawerWrapper>,
        );
        expect(screen.getByText('Open')).toBeInTheDocument();
    });

    it('opens on trigger click and shows title', async () => {
        const user = userEvent.setup();
        render(
            <DrawerWrapper
                trigger={<button type="button" />}
                triggerChildren="Open"
                title="My Drawer"
            >
                Content
            </DrawerWrapper>,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByText('My Drawer')).toBeInTheDocument();
    });

    it('renders description when provided', async () => {
        const user = userEvent.setup();
        render(
            <DrawerWrapper
                trigger={<button type="button" />}
                triggerChildren="Open"
                title="T"
                description="Some description"
            >
                Content
            </DrawerWrapper>,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByText('Some description')).toBeInTheDocument();
    });

    it('renders children in the body slot', async () => {
        const user = userEvent.setup();
        render(
            <DrawerWrapper
                trigger={<button type="button" />}
                triggerChildren="Open"
                title="T"
            >
                <span>Body text</span>
            </DrawerWrapper>,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByText('Body text')).toBeInTheDocument();
        expect(
            document.querySelector('[data-slot="drawer-body"]'),
        ).toBeInTheDocument();
    });

    it('renders footer node when provided', async () => {
        const user = userEvent.setup();
        render(
            <DrawerWrapper
                trigger={<button type="button" />}
                triggerChildren="Open"
                title="T"
                footer={<button type="button">Save</button>}
            >
                Content
            </DrawerWrapper>,
        );
        await user.click(screen.getByText('Open'));
        expect(
            screen.getByRole('button', { name: 'Save' }),
        ).toBeInTheDocument();
    });

    it('renders with controlled open=true', () => {
        render(
            <DrawerWrapper open title="Controlled Drawer">
                Content
            </DrawerWrapper>,
        );
        expect(screen.getByText('Controlled Drawer')).toBeInTheDocument();
    });

    it('calls onOpenChange when DrawerClose is clicked in the footer', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        render(
            <DrawerWrapper
                open
                onOpenChange={onOpenChange}
                title="T"
                footer={
                    <DrawerClose>
                        <button type="button">Cancel</button>
                    </DrawerClose>
                }
            >
                Content
            </DrawerWrapper>,
        );
        await user.click(screen.getByText('Cancel'));
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('does not render a header when no title or description is given', () => {
        render(
            <DrawerWrapper open>
                <span>Body only</span>
            </DrawerWrapper>,
        );
        expect(
            document.querySelector('[data-slot="drawer-header"]'),
        ).not.toBeInTheDocument();
    });

    it('hides the header when hideHeader is true even with a title', () => {
        render(
            <DrawerWrapper open title="Hidden title" hideHeader>
                Content
            </DrawerWrapper>,
        );
        expect(
            document.querySelector('[data-slot="drawer-header"]'),
        ).not.toBeInTheDocument();
        expect(screen.queryByText('Hidden title')).not.toBeInTheDocument();
    });

    it('passes direction through to the content', () => {
        render(
            <DrawerWrapper open direction="left" title="T">
                Content
            </DrawerWrapper>,
        );
        expect(
            document.querySelector('[data-vaul-drawer-direction="left"]'),
        ).toBeInTheDocument();
    });

    it('does not render a handle by default', () => {
        render(
            <DrawerWrapper open title="T">
                Content
            </DrawerWrapper>,
        );
        expect(
            document.querySelector('[data-slot="drawer-handle"]'),
        ).not.toBeInTheDocument();
    });

    it('renders a handle when showHandle is true', () => {
        render(
            <DrawerWrapper open title="T" showHandle>
                Content
            </DrawerWrapper>,
        );
        expect(
            document.querySelector('[data-slot="drawer-handle"]'),
        ).toBeInTheDocument();
    });
});
