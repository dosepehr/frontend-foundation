import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { toast } from 'sonner';
import ButtonWrapper from '../Button';

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
        <ButtonWrapper
            variant='outline'
            onClick={() => toast('This is a default toast')}
        >
            Show toast
        </ButtonWrapper>
    ),
};

export const Success: Story = {
    render: () => (
        <ButtonWrapper
            variant='success'
            onClick={() => toast.success('Operation completed successfully')}
        >
            Show success
        </ButtonWrapper>
    ),
};

export const Error: Story = {
    render: () => (
        <ButtonWrapper
            variant='destructive'
            onClick={() => toast.error('Something went wrong')}
        >
            Show error
        </ButtonWrapper>
    ),
};

export const Warning: Story = {
    render: () => (
        <ButtonWrapper
            variant='warning'
            onClick={() => toast.warning('Proceed with caution')}
        >
            Show warning
        </ButtonWrapper>
    ),
};

export const Info: Story = {
    render: () => (
        <ButtonWrapper
            variant='info'
            onClick={() => toast.info('Here is some information')}
        >
            Show info
        </ButtonWrapper>
    ),
};

export const Loading: Story = {
    render: () => (
        <ButtonWrapper
            variant='outline'
            onClick={() => toast.loading('Loading, please wait…')}
        >
            Show loading
        </ButtonWrapper>
    ),
};

export const WithDescription: Story = {
    render: () => (
        <ButtonWrapper
            variant='outline'
            onClick={() =>
                toast('Event created', {
                    description: 'Monday, January 1st at 12:00 PM',
                })
            }
        >
            Show with description
        </ButtonWrapper>
    ),
};

export const WithAction: Story = {
    render: () => (
        <ButtonWrapper
            variant='outline'
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
        </ButtonWrapper>
    ),
};

export const ToastPromise: Story = {
    render: () => (
        <ButtonWrapper
            variant='outline'
            onClick={() =>
                toast.promise(
                    new Promise((resolve) => setTimeout(resolve, 2000)),
                    {
                        loading: 'Saving changes…',
                        success: 'Changes saved successfully',
                        error: 'Failed to save changes',
                    }
                )
            }
        >
            Show promise
        </ButtonWrapper>
    ),
};

export const AllTypes: Story = {
    render: () => (
        <div className='flex flex-wrap gap-2'>
            <ButtonWrapper variant='outline' onClick={() => toast('Default')}>
                Default
            </ButtonWrapper>
            <ButtonWrapper
                variant='success'
                onClick={() => toast.success('Success')}
            >
                Success
            </ButtonWrapper>
            <ButtonWrapper
                variant='destructive'
                onClick={() => toast.error('Error')}
            >
                Error
            </ButtonWrapper>
            <ButtonWrapper
                variant='warning'
                onClick={() => toast.warning('Warning')}
            >
                Warning
            </ButtonWrapper>
            <ButtonWrapper variant='info' onClick={() => toast.info('Info')}>
                Info
            </ButtonWrapper>
            <ButtonWrapper
                variant='outline'
                onClick={() => toast.loading('Loading…')}
            >
                Loading
            </ButtonWrapper>
        </div>
    ),
};

