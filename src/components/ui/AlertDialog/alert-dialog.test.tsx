import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from './components';
import AlertDialogWrapper from './index';

// Minimal full dialog for primitive tests
function TestDialog({ onAction, onCancel }: { onAction?: () => void; onCancel?: () => void }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger>Open</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogTitle>Confirm action</AlertDialogTitle>
                <AlertDialogDescription>Are you sure?</AlertDialogDescription>
                <AlertDialogAction onClick={onAction}>Confirm</AlertDialogAction>
                <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
            </AlertDialogContent>
        </AlertDialog>
    );
}

describe('AlertDialog primitives', () => {
    it('dialog is not visible on mount', () => {
        render(<TestDialog />);
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    it('opens on trigger click', async () => {
        const user = userEvent.setup();
        render(<TestDialog />);
        await user.click(screen.getByText('Open'));
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    it('renders title and description when open', async () => {
        const user = userEvent.setup();
        render(<TestDialog />);
        await user.click(screen.getByText('Open'));
        expect(screen.getByText('Confirm action')).toBeInTheDocument();
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });

    it('action button closes the dialog', async () => {
        const user = userEvent.setup();
        render(<TestDialog />);
        await user.click(screen.getByText('Open'));
        await user.click(screen.getByText('Confirm'));
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    it('cancel button closes the dialog', async () => {
        const user = userEvent.setup();
        render(<TestDialog />);
        await user.click(screen.getByText('Open'));
        await user.click(screen.getByText('Cancel'));
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    it('calls onAction callback when action is clicked', async () => {
        const user = userEvent.setup();
        const onAction = vi.fn();
        render(<TestDialog onAction={onAction} />);
        await user.click(screen.getByText('Open'));
        await user.click(screen.getByText('Confirm'));
        expect(onAction).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel callback when cancel is clicked', async () => {
        const user = userEvent.setup();
        const onCancel = vi.fn();
        render(<TestDialog onCancel={onCancel} />);
        await user.click(screen.getByText('Open'));
        await user.click(screen.getByText('Cancel'));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('keyboard: Escape closes the dialog', async () => {
        const user = userEvent.setup();
        render(<TestDialog />);
        await user.click(screen.getByText('Open'));
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
        await user.keyboard('{Escape}');
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
});

describe('AlertDialogWrapper', () => {
    it('dialog is not visible on mount', () => {
        render(
            <AlertDialogWrapper
                trigger={<button>Open</button>}
                title='Delete item'
                description='This cannot be undone.'
            />,
        );
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    it('opens when trigger is clicked', async () => {
        const user = userEvent.setup();
        render(
            <AlertDialogWrapper
                trigger={<button>Open</button>}
                title='Delete item'
                description='This cannot be undone.'
            />,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    it('renders title and description', async () => {
        const user = userEvent.setup();
        render(
            <AlertDialogWrapper
                trigger={<button>Open</button>}
                title='Delete item'
                description='This cannot be undone.'
            />,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByText('Delete item')).toBeInTheDocument();
        expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
    });

    it('renders default confirm and cancel labels', async () => {
        const user = userEvent.setup();
        render(
            <AlertDialogWrapper
                trigger={<button>Open</button>}
                title='Title'
                description='Desc'
            />,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByText('Continue')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('renders custom confirm and cancel labels', async () => {
        const user = userEvent.setup();
        render(
            <AlertDialogWrapper
                trigger={<button>Open</button>}
                title='Title'
                description='Desc'
                confirmLabel='Delete'
                cancelLabel='Go back'
            />,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByText('Delete')).toBeInTheDocument();
        expect(screen.getByText('Go back')).toBeInTheDocument();
    });

    it('renders media slot when provided', async () => {
        const user = userEvent.setup();
        render(
            <AlertDialogWrapper
                trigger={<button>Open</button>}
                title='Title'
                description='Desc'
                media={<span data-testid='media-icon' />}
            />,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByTestId('media-icon')).toBeInTheDocument();
    });

    it('does not render media slot when omitted', async () => {
        const user = userEvent.setup();
        const { container } = render(
            <AlertDialogWrapper
                trigger={<button>Open</button>}
                title='Title'
                description='Desc'
            />,
        );
        await user.click(screen.getByText('Open'));
        expect(container.querySelector('[data-slot="alert-dialog-media"]')).not.toBeInTheDocument();
    });

    it('confirm button closes the dialog', async () => {
        const user = userEvent.setup();
        render(
            <AlertDialogWrapper
                trigger={<button>Open</button>}
                title='Title'
                description='Desc'
            />,
        );
        await user.click(screen.getByText('Open'));
        await user.click(screen.getByText('Continue'));
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    it('cancel button closes the dialog', async () => {
        const user = userEvent.setup();
        render(
            <AlertDialogWrapper
                trigger={<button>Open</button>}
                title='Title'
                description='Desc'
            />,
        );
        await user.click(screen.getByText('Open'));
        await user.click(screen.getByText('Cancel'));
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    it('calls actionProps.onClick when confirmed', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(
            <AlertDialogWrapper
                trigger={<button>Open</button>}
                title='Title'
                description='Desc'
                actionProps={{ onClick }}
            />,
        );
        await user.click(screen.getByText('Open'));
        await user.click(screen.getByText('Continue'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
