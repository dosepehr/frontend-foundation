import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DialogWrapper from './index';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogBody,
    DialogFooter,
    DialogTrigger,
} from './components';

describe('Dialog primitives', () => {
    it('renders trigger', () => {
        render(
            <Dialog>
                <DialogTrigger>Open</DialogTrigger>
            </Dialog>,
        );
        expect(screen.getByText('Open')).toBeInTheDocument();
    });

    it('content is not visible by default', () => {
        render(
            <Dialog>
                <DialogTrigger>Open</DialogTrigger>
                <DialogContent>
                    <DialogTitle>My Dialog</DialogTitle>
                </DialogContent>
            </Dialog>,
        );
        expect(screen.queryByText('My Dialog')).not.toBeInTheDocument();
    });

    it('content is visible when open is true', () => {
        render(
            <Dialog open>
                <DialogContent aria-describedby={undefined}>
                    <DialogTitle>My Dialog</DialogTitle>
                </DialogContent>
            </Dialog>,
        );
        expect(screen.getByText('My Dialog')).toBeInTheDocument();
    });

    it('opens on trigger click', async () => {
        const user = userEvent.setup();
        render(
            <Dialog>
                <DialogTrigger>Open</DialogTrigger>
                <DialogContent aria-describedby={undefined}>
                    <DialogTitle>My Dialog</DialogTitle>
                </DialogContent>
            </Dialog>,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByText('My Dialog')).toBeInTheDocument();
    });

    it('calls onOpenChange when trigger is clicked', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        render(
            <Dialog onOpenChange={onOpenChange}>
                <DialogTrigger>Open</DialogTrigger>
                <DialogContent aria-describedby={undefined}><DialogTitle>T</DialogTitle></DialogContent>
            </Dialog>,
        );
        await user.click(screen.getByText('Open'));
        expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('renders title inside DialogHeader', () => {
        render(
            <Dialog open>
                <DialogContent aria-describedby={undefined}>
                    <DialogHeader showCloseButton={false}>
                        <DialogTitle>Title text</DialogTitle>
                    </DialogHeader>
                </DialogContent>
            </Dialog>,
        );
        expect(screen.getByText('Title text')).toBeInTheDocument();
    });

    it('renders description inside DialogHeader', () => {
        render(
            <Dialog open>
                <DialogContent>
                    <DialogHeader showCloseButton={false}>
                        <DialogTitle>T</DialogTitle>
                        <DialogDescription>Desc text</DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>,
        );
        expect(screen.getByText('Desc text')).toBeInTheDocument();
    });

    it('renders close button in DialogHeader by default', () => {
        render(
            <Dialog open>
                <DialogContent aria-describedby={undefined}>
                    <DialogHeader>
                        <DialogTitle>T</DialogTitle>
                    </DialogHeader>
                </DialogContent>
            </Dialog>,
        );
        expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('hides close button when showCloseButton is false', () => {
        render(
            <Dialog open>
                <DialogContent aria-describedby={undefined}>
                    <DialogHeader showCloseButton={false}>
                        <DialogTitle>T</DialogTitle>
                    </DialogHeader>
                </DialogContent>
            </Dialog>,
        );
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    });

    it('renders body content', () => {
        render(
            <Dialog open>
                <DialogContent aria-describedby={undefined}>
                    <DialogTitle>T</DialogTitle>
                    <DialogBody>Body content</DialogBody>
                </DialogContent>
            </Dialog>,
        );
        expect(screen.getByText('Body content')).toBeInTheDocument();
    });

    it('renders footer content', () => {
        render(
            <Dialog open>
                <DialogContent aria-describedby={undefined}>
                    <DialogTitle>T</DialogTitle>
                    <DialogFooter>Footer content</DialogFooter>
                </DialogContent>
            </Dialog>,
        );
        expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('renders data-slot="dialog-content" on content', () => {
        render(
            <Dialog open>
                <DialogContent aria-describedby={undefined}>
                    <DialogTitle>T</DialogTitle>
                </DialogContent>
            </Dialog>,
        );
        expect(document.querySelector('[data-slot="dialog-content"]')).toBeInTheDocument();
    });
});

describe('DialogWrapper', () => {
    it('renders trigger', () => {
        render(
            <DialogWrapper trigger={<button>Open</button>} title='My Dialog'>
                Content
            </DialogWrapper>,
        );
        expect(screen.getByText('Open')).toBeInTheDocument();
    });

    it('opens on trigger click and shows title', async () => {
        const user = userEvent.setup();
        render(
            <DialogWrapper trigger={<button>Open</button>} title='My Dialog'>
                Content
            </DialogWrapper>,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByText('My Dialog')).toBeInTheDocument();
    });

    it('renders description when provided', async () => {
        const user = userEvent.setup();
        render(
            <DialogWrapper
                trigger={<button>Open</button>}
                title='T'
                description='Some description'
            >
                Content
            </DialogWrapper>,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByText('Some description')).toBeInTheDocument();
    });

    it('renders children in body', async () => {
        const user = userEvent.setup();
        render(
            <DialogWrapper trigger={<button>Open</button>} title='T'>
                <span>Body text</span>
            </DialogWrapper>,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByText('Body text')).toBeInTheDocument();
    });

    it('renders cancel button by default', async () => {
        const user = userEvent.setup();
        render(
            <DialogWrapper trigger={<button>Open</button>} title='T'>
                Content
            </DialogWrapper>,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('renders custom cancelLabel', async () => {
        const user = userEvent.setup();
        render(
            <DialogWrapper trigger={<button>Open</button>} title='T' cancelLabel='Dismiss'>
                Content
            </DialogWrapper>,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByText('Dismiss')).toBeInTheDocument();
    });

    it('hides cancel button when showCancelButton is false', async () => {
        const user = userEvent.setup();
        render(
            <DialogWrapper trigger={<button>Open</button>} title='T' showCancelButton={false}>
                Content
            </DialogWrapper>,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });

    it('renders footer node when provided', async () => {
        const user = userEvent.setup();
        render(
            <DialogWrapper
                trigger={<button>Open</button>}
                title='T'
                footer={<button>Save</button>}
            >
                Content
            </DialogWrapper>,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('renders with controlled open=true', () => {
        render(
            <DialogWrapper open title='Controlled Dialog'>
                Content
            </DialogWrapper>,
        );
        expect(screen.getByText('Controlled Dialog')).toBeInTheDocument();
    });

    it('calls onOpenChange when close button is clicked', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        render(
            <DialogWrapper open onOpenChange={onOpenChange} title='T' showCloseIcon>
                Content
            </DialogWrapper>,
        );
        await user.click(screen.getByRole('button', { name: /close/i }));
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('renders icon in title when icon prop is provided', async () => {
        const user = userEvent.setup();
        render(
            <DialogWrapper
                trigger={<button>Open</button>}
                title='My Dialog'
                icon={<span data-testid='dialog-icon'>*</span>}
            >
                Content
            </DialogWrapper>,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByTestId('dialog-icon')).toBeInTheDocument();
    });

    it('does not render header when no title, description, or icon', () => {
        render(
            <DialogWrapper open>
                <span>Body only</span>
            </DialogWrapper>,
        );
        expect(document.querySelector('[data-slot="dialog-header"]')).not.toBeInTheDocument();
    });
});
