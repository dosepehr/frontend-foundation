import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
} from './components';

describe('Sheet', () => {
    it('renders trigger without errors', () => {
        render(
            <Sheet>
                <SheetTrigger>Open</SheetTrigger>
                <SheetContent aria-describedby={undefined}>
                    <SheetTitle>Sheet Title</SheetTitle>
                </SheetContent>
            </Sheet>,
        );
        expect(screen.getByText('Open')).toBeInTheDocument();
    });

    it('content is not visible by default', () => {
        render(
            <Sheet>
                <SheetTrigger>Open</SheetTrigger>
                <SheetContent aria-describedby={undefined}>
                    <SheetTitle>Sheet Title</SheetTitle>
                </SheetContent>
            </Sheet>,
        );
        expect(document.querySelector('[data-slot="sheet-content"]')).not.toBeInTheDocument();
    });

    it('content becomes visible after trigger click', async () => {
        const user = userEvent.setup();
        render(
            <Sheet>
                <SheetTrigger>Open</SheetTrigger>
                <SheetContent aria-describedby={undefined}>
                    <SheetTitle>Sheet Title</SheetTitle>
                </SheetContent>
            </Sheet>,
        );
        await user.click(screen.getByText('Open'));
        expect(document.querySelector('[data-slot="sheet-content"]')).toBeInTheDocument();
    });

    it('content is visible when open prop is true', () => {
        render(
            <Sheet open>
                <SheetContent aria-describedby={undefined}>
                    <SheetTitle>My Sheet</SheetTitle>
                </SheetContent>
            </Sheet>,
        );
        expect(document.querySelector('[data-slot="sheet-content"]')).toBeInTheDocument();
    });

    it('renders SheetTitle text', () => {
        render(
            <Sheet open>
                <SheetContent aria-describedby={undefined}>
                    <SheetTitle>Sheet Heading</SheetTitle>
                </SheetContent>
            </Sheet>,
        );
        expect(screen.getByText('Sheet Heading')).toBeInTheDocument();
    });

    it('renders SheetDescription text', () => {
        render(
            <Sheet open>
                <SheetContent>
                    <SheetTitle>Title</SheetTitle>
                    <SheetDescription>Some description</SheetDescription>
                </SheetContent>
            </Sheet>,
        );
        expect(screen.getByText('Some description')).toBeInTheDocument();
    });

    it('SheetHeader has data-slot="sheet-header"', () => {
        render(
            <Sheet open>
                <SheetContent aria-describedby={undefined}>
                    <SheetHeader>
                        <SheetTitle>Title</SheetTitle>
                    </SheetHeader>
                </SheetContent>
            </Sheet>,
        );
        expect(document.querySelector('[data-slot="sheet-header"]')).toBeInTheDocument();
    });

    it('SheetFooter has data-slot="sheet-footer"', () => {
        render(
            <Sheet open>
                <SheetContent aria-describedby={undefined}>
                    <SheetTitle>Title</SheetTitle>
                    <SheetFooter>Footer</SheetFooter>
                </SheetContent>
            </Sheet>,
        );
        expect(document.querySelector('[data-slot="sheet-footer"]')).toBeInTheDocument();
    });

    it('calls onOpenChange when opened', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        render(
            <Sheet onOpenChange={onOpenChange}>
                <SheetTrigger>Open</SheetTrigger>
                <SheetContent aria-describedby={undefined}>
                    <SheetTitle>Title</SheetTitle>
                </SheetContent>
            </Sheet>,
        );
        await user.click(screen.getByText('Open'));
        expect(onOpenChange).toHaveBeenCalledWith(true);
    });
});
