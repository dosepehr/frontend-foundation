import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { toast } from 'sonner';
import Button from '../Button';

const meta = {
    title: 'UI/Toast',
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Button
            variant="outline"
            onClick={() => toast('This is a default toast')}
        >
            Show toast
        </Button>
    ),
};

export const Success: Story = {
    render: () => (
        <Button
            variant="success"
            onClick={() => toast.success('Operation completed successfully')}
        >
            Show success
        </Button>
    ),
};

export const Error: Story = {
    render: () => (
        <Button
            variant="destructive"
            onClick={() => toast.error('Something went wrong')}
        >
            Show error
        </Button>
    ),
};

export const Warning: Story = {
    render: () => (
        <Button
            variant="warning"
            onClick={() => toast.warning('Proceed with caution')}
        >
            Show warning
        </Button>
    ),
};

export const Info: Story = {
    render: () => (
        <Button
            variant="info"
            onClick={() => toast.info('Here is some information')}
        >
            Show info
        </Button>
    ),
};

export const Loading: Story = {
    render: () => (
        <Button
            variant="outline"
            onClick={() => toast.loading('Loading, please wait…')}
        >
            Show loading
        </Button>
    ),
};

export const WithDescription: Story = {
    render: () => (
        <Button
            variant="outline"
            onClick={() =>
                toast('Event created', {
                    description: 'Monday, January 1st at 12:00 PM',
                })
            }
        >
            Show with description
        </Button>
    ),
};

export const WithAction: Story = {
    render: () => (
        <Button
            variant="outline"
            onClick={() =>
                toast('File deleted', {
                    description: 'document.pdf has been deleted',
                    action: {
                        label: 'Undo',
                        onClick: () => toast.success('Deletion undone'),
                    },
                })
            }
        >
            Show with action
        </Button>
    ),
};

export const ToastPromise: Story = {
    render: () => (
        <Button
            variant="outline"
            onClick={() =>
                toast.promise(
                    new Promise((resolve) => setTimeout(resolve, 2000)),
                    {
                        loading: 'Saving changes…',
                        success: 'Changes saved successfully',
                        error: 'Failed to save changes',
                    },
                )
            }
        >
            Show promise
        </Button>
    ),
};

export const AllTypes: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast('Default')}>
                Default
            </Button>
            <Button variant="success" onClick={() => toast.success('Success')}>
                Success
            </Button>
            <Button variant="destructive" onClick={() => toast.error('Error')}>
                Error
            </Button>
            <Button variant="warning" onClick={() => toast.warning('Warning')}>
                Warning
            </Button>
            <Button variant="info" onClick={() => toast.info('Info')}>
                Info
            </Button>
            <Button variant="outline" onClick={() => toast.loading('Loading…')}>
                Loading
            </Button>
        </div>
    ),
};
