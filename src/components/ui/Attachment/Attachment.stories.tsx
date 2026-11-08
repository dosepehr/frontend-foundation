import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DownloadIcon, RefreshCwIcon, Trash2Icon, XIcon } from 'lucide-react';
import AttachmentWrapper from '.';
import { AttachmentAction, AttachmentGroup } from './components';

const meta: Meta<typeof AttachmentWrapper> = {
    title: 'UI/Attachment',
    component: AttachmentWrapper,
    tags: ['autodocs'],
    argTypes: {
        state: {
            control: 'select',
            options: ['idle', 'uploading', 'processing', 'error', 'done'],
            description: 'Upload or processing state of the attachment',
        },
        size: {
            control: 'select',
            options: ['default', 'sm', 'xs'],
            description: 'Size of the attachment card',
        },
        orientation: {
            control: 'radio',
            options: ['horizontal', 'vertical'],
            description: 'Layout direction',
        },
        name: {
            control: 'text',
            description: 'File name shown as the title',
        },
        description: {
            control: 'text',
            description:
                'Metadata text below the title. When omitted and state is uploading/processing, shows a skeleton.',
        },
        imageSrc: {
            control: 'text',
            description: 'Image URL — switches the media slot to image variant',
        },
        imageAlt: {
            control: 'text',
            description: 'Alt text for the image',
        },
        href: {
            control: 'text',
            description: 'Makes the entire card a navigable link',
        },
    },
};

export default meta;
type Story = StoryObj<typeof AttachmentWrapper>;

export const Default: Story = {
    args: {
        name: 'design-specs.pdf',
        description: '2.4 MB · PDF',
        state: 'done',
    },
};

export const WithActions: Story = {
    args: {
        name: 'report.xlsx',
        description: '1.1 MB · Excel',
        state: 'done',
        actions: (
            <>
                <AttachmentAction aria-label="Download">
                    <DownloadIcon />
                </AttachmentAction>
                <AttachmentAction variant="destructive" aria-label="Delete">
                    <Trash2Icon />
                </AttachmentAction>
            </>
        ),
    },
};

export const Idle: Story = {
    args: {
        name: 'selected-file.pdf',
        description: 'Ready to upload',
        state: 'idle',
    },
};

export const Uploading: Story = {
    args: {
        name: 'design-system.zip',
        description: 'Uploading · 64%',
        state: 'uploading',
    },
};

export const UploadingNoDescription: Story = {
    name: 'Uploading (skeleton description)',
    args: {
        name: 'design-system.zip',
        state: 'uploading',
    },
};

export const Processing: Story = {
    args: {
        name: 'market-research.pdf',
        description: 'Processing document',
        state: 'processing',
    },
};

export const ErrorState: Story = {
    args: {
        name: 'financial-model.xlsx',
        description: 'Upload failed. Try again.',
        state: 'error',
    },
};

export const AllStates: Story = {
    render: () => (
        <div className="mx-auto flex w-full max-w-sm flex-col gap-2">
            <AttachmentWrapper
                state="idle"
                name="selected-file.pdf"
                description="Ready to upload"
                className="w-full"
                actions={
                    <AttachmentAction aria-label="Remove selected-file.pdf">
                        <XIcon />
                    </AttachmentAction>
                }
            />
            <AttachmentWrapper
                state="uploading"
                name="design-system.zip"
                description="Uploading · 64%"
                className="w-full"
                actions={
                    <AttachmentAction aria-label="Cancel upload">
                        <XIcon />
                    </AttachmentAction>
                }
            />
            <AttachmentWrapper
                state="processing"
                name="market-research.pdf"
                description="Processing document"
                className="w-full"
                actions={
                    <AttachmentAction aria-label="Remove market-research.pdf">
                        <XIcon />
                    </AttachmentAction>
                }
            />
            <AttachmentWrapper
                state="error"
                name="financial-model.xlsx"
                description="Upload failed. Try again."
                className="w-full"
                actions={
                    <>
                        <AttachmentAction aria-label="Retry upload">
                            <RefreshCwIcon />
                        </AttachmentAction>
                        <AttachmentAction aria-label="Remove financial-model.xlsx">
                            <XIcon />
                        </AttachmentAction>
                    </>
                }
            />
            <AttachmentWrapper
                state="done"
                name="uploaded-report.pdf"
                description="Uploaded · 1.8 MB"
                className="w-full"
                actions={
                    <AttachmentAction aria-label="Remove uploaded-report.pdf">
                        <XIcon />
                    </AttachmentAction>
                }
            />
        </div>
    ),
    args: {},
};

export const AllSizes: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <AttachmentWrapper
                size="default"
                name="attachment-file.pdf"
                description="1.2 MB · PDF"
            />
            <AttachmentWrapper
                size="sm"
                name="attachment-file.pdf"
                description="1.2 MB · PDF"
            />
            <AttachmentWrapper
                size="xs"
                name="attachment-file.pdf"
                description="1.2 MB · PDF"
            />
        </div>
    ),
    args: {},
};

export const Vertical: Story = {
    render: () => (
        <div className="flex gap-3">
            <AttachmentWrapper
                state="done"
                orientation="vertical"
                name="photo.jpg"
                description="3.2 MB"
            />
            <AttachmentWrapper
                state="uploading"
                orientation="vertical"
                name="photo.jpg"
                description="3.2 MB"
            />
            <AttachmentWrapper
                state="error"
                orientation="vertical"
                name="photo.jpg"
                description="3.2 MB"
            />
        </div>
    ),
    args: {},
};

export const AsLink: Story = {
    args: {
        name: 'linked-document.pdf',
        description: '2.1 MB · PDF',
        href: '#',
    },
};

export const Group: Story = {
    render: () => (
        <div className="w-96">
            <AttachmentGroup>
                {[
                    { name: 'report.pdf', description: '2.4 MB · PDF' },
                    { name: 'spreadsheet.xlsx', description: '1.1 MB · Excel' },
                    { name: 'presentation.pptx', description: '5.8 MB · PPT' },
                    { name: 'notes.docx', description: '320 KB · Word' },
                ].map(({ name, description }) => (
                    <AttachmentWrapper
                        key={name}
                        name={name}
                        description={description}
                    />
                ))}
            </AttachmentGroup>
        </div>
    ),
    args: {},
};
