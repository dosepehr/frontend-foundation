import Button from '@/components/ui/Button';
import { FieldGroup } from '@/components/ui/Field';
import type { FormEventHandler, ReactNode } from 'react';

interface FormPreviewProps {
    onSubmit: FormEventHandler<HTMLFormElement>;
    submitted: unknown;
    children: ReactNode;
}

// Story wrapper for react-hook-form fields: the form, a submit button and
// the last submitted values.
export default function FormPreview({
    onSubmit,
    submitted,
    children,
}: FormPreviewProps) {
    return (
        <form
            onSubmit={onSubmit}
            className="flex w-80 flex-col gap-8"
            noValidate
        >
            <FieldGroup>{children}</FieldGroup>
            <Button type="submit">Submit</Button>
            {submitted !== null && (
                <pre className="rounded-md bg-muted p-3 text-xs">
                    {JSON.stringify(submitted, null, 2)}
                </pre>
            )}
        </form>
    );
}
