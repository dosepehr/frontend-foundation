import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Dnd from '.';
import { ControlledDnd } from '../../controlled/ControlledDnd';
import { Button } from '../Button/components';
import type { DndFile } from './dnd.types';

const meta: Meta<typeof Dnd> = {
    title: 'UI/Dnd',
    component: Dnd,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    argTypes: {
        label: { control: 'text' },
        description: { control: 'text' },
        error: { control: 'text' },
        required: { control: 'boolean' },
        disabled: { control: 'boolean' },
        multiple: { control: 'boolean' },
        maxFiles: { control: 'number' },
        maxSizeMB: { control: 'number' },
        showPreview: { control: 'boolean' },
        confirmRemove: { control: 'boolean' },
    },
    decorators: [
        (Story) => (
            <div className="w-96">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Dnd>;

export const Default: Story = {
    args: {
        label: 'Upload file',
    },
};

export const WithDescription: Story = {
    args: {
        label: 'Profile picture',
        description: 'PNG or JPG, up to 5MB.',
        accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
        maxSizeMB: 5,
    },
};

export const WithError: Story = {
    args: {
        label: 'Contract',
        error: 'A file is required.',
        required: true,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Upload file',
        disabled: true,
    },
};

export const RestrictedType: Story = {
    args: {
        label: 'Upload document',
        description: 'Only PDF files are accepted.',
        accept: { 'application/pdf': ['.pdf'] },
    },
};

export const MultipleFiles: Story = {
    args: {
        label: 'Upload attachments',
        description: 'You can add up to 4 files.',
        multiple: true,
        maxFiles: 4,
    },
};

export const ConfirmOnRemove: Story = {
    args: {
        label: 'Upload attachments',
        multiple: true,
        maxFiles: 4,
        confirmRemove: true,
    },
};

// ─── Controlled ─────────────────────────────────────────────────────────────

export const Controlled: Story = {
    render: () => {
        const [files, setFiles] = React.useState<DndFile[]>([]);

        return (
            <div className="flex flex-col gap-4">
                <Dnd
                    label="Upload attachments"
                    multiple
                    maxFiles={3}
                    value={files}
                    onChange={setFiles}
                />
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFiles([])}
                    >
                        Clear
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                    {files.length} file(s) selected
                </p>
            </div>
        );
    },
};

// ─── React Hook Form + Zod ──────────────────────────────────────────────────

const fileSchema = z
    .array(
        z.object({
            id: z.string(),
            file: z.instanceof(File).optional(),
            name: z.string(),
            size: z.number().optional(),
            type: z.string().optional(),
            previewUrl: z.string().optional(),
            isExisting: z.boolean().optional(),
            state: z.string().optional(),
            error: z.string().optional(),
        }),
    )
    .min(1, { message: 'Please upload at least one file.' })
    .max(3, { message: 'You can upload up to 3 files.' });

const schema = z.object({
    attachments: fileSchema,
});

type FormValues = z.infer<typeof schema>;

export const WithReactHookForm: Story = {
    render: () => {
        const {
            control,
            handleSubmit,
            formState: { isSubmitSuccessful },
            reset,
        } = useForm<FormValues>({
            resolver: zodResolver(schema),
            defaultValues: { attachments: [] },
        });

        return (
            <form
                onSubmit={handleSubmit(() => {})}
                className="flex w-96 flex-col gap-4"
            >
                <ControlledDnd<FormValues>
                    control={control}
                    name="attachments"
                    label="Upload attachments"
                    description="Up to 3 files, 5MB each."
                    multiple
                    maxFiles={3}
                    maxSizeMB={5}
                    required
                />
                <div className="flex gap-2">
                    <Button type="submit" size="sm">
                        Submit
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => reset()}
                    >
                        Reset
                    </Button>
                </div>
                {isSubmitSuccessful && (
                    <p className="text-sm text-success">
                        Form submitted successfully.
                    </p>
                )}
            </form>
        );
    },
};
