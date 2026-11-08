import type { Problem } from './http-errors.types';

// Client-side result of an operation: either a response or the problem that
// prevented it.
export type OperationResult<T> = {
    isSuccess: boolean;
    error?: Problem;
    response?: T;
};
