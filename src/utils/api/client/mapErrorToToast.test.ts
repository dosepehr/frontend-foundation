import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import { describe, expect, it, vi } from 'vitest';
import { mapErrorToToast } from './mapErrorToToast';

vi.mock('sonner', () => ({ toast: { error: vi.fn() } }));

function makeAxiosError(response?: {
    status: number;
    data?: unknown;
}): AxiosError {
    return { response } as unknown as AxiosError;
}

describe('mapErrorToToast', () => {
    it('shows a network error toast when the error has no response', () => {
        mapErrorToToast(makeAxiosError());

        expect(toast.error).toHaveBeenCalledWith(
            'Network error. Please check your internet connection.',
        );
    });

    it('shows a generic error toast when the response has no data', () => {
        mapErrorToToast(makeAxiosError({ status: 500, data: undefined }));

        expect(toast.error).toHaveBeenCalledWith(
            'An unexpected error occurred.',
        );
    });

    it('applies the registered handler for a known status code', () => {
        mapErrorToToast(
            makeAxiosError({
                status: 404,
                data: { status: false, message: 'ignored' },
            }),
        );

        expect(toast.error).toHaveBeenCalledWith(
            'The requested resource was not found.',
        );
    });

    it('passes the raw data through when there is no handler for the status code', () => {
        mapErrorToToast(
            makeAxiosError({
                status: 418,
                data: { status: false, message: "I'm a teapot" },
            }),
        );

        expect(toast.error).toHaveBeenCalledWith("I'm a teapot");
    });

    it('prefers the first errors value when it is an array', () => {
        mapErrorToToast(
            makeAxiosError({
                status: 418,
                data: {
                    status: false,
                    message: 'fallback message',
                    errors: { email: ['Email is invalid', 'Email is taken'] },
                },
            }),
        );

        expect(toast.error).toHaveBeenCalledWith('Email is invalid');
    });

    it('prefers the first errors value when it is a plain string', () => {
        mapErrorToToast(
            makeAxiosError({
                status: 418,
                data: {
                    status: false,
                    message: 'fallback message',
                    errors: { email: 'Email is invalid' },
                },
            }),
        );

        expect(toast.error).toHaveBeenCalledWith('Email is invalid');
    });

    it('falls back to the top-level message when the first errors value is empty', () => {
        mapErrorToToast(
            makeAxiosError({
                status: 418,
                data: {
                    status: false,
                    message: 'fallback message',
                    errors: { email: [] },
                },
            }),
        );

        expect(toast.error).toHaveBeenCalledWith('fallback message');
    });

    it('falls back to the top-level message when there are no errors', () => {
        mapErrorToToast(
            makeAxiosError({
                status: 418,
                data: { status: false, message: 'Top level message' },
            }),
        );

        expect(toast.error).toHaveBeenCalledWith('Top level message');
    });

    it('falls back to a generic message when there is neither errors nor a message', () => {
        mapErrorToToast(
            makeAxiosError({
                status: 418,
                data: { status: false, message: '' },
            }),
        );

        expect(toast.error).toHaveBeenCalledWith(
            'Something went wrong. Please try again.',
        );
    });
});
