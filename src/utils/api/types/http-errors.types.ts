// Error envelope returned by the API, plus one discriminated variant per
// `type` the backend sends. `ApiError` is the union the client and the
// query/mutation hooks work with.

export interface ErrorResponse {
    status: false;
    message: string;
    errors?: Record<string, string[]>;
}

export interface Problem extends ErrorResponse {
    type?: string;
}

export interface BadRequestError extends Problem {
    type: 'BadRequest';
}

export interface UnauthorizedError extends Problem {
    type: 'Unauthorized';
}

export interface ValidationError extends Problem {
    type: 'ValidationError';
}

export interface NotFoundError extends Problem {
    type: 'NotFound';
}

export interface ConflictError extends Problem {
    type: 'Conflict';
}

export interface NetworkError extends Problem {
    type: 'NetworkError';
}

export interface UnhandledException extends Problem {
    type: 'UnhandledException';
}

export type ApiError =
    | BadRequestError
    | UnauthorizedError
    | ValidationError
    | NotFoundError
    | ConflictError
    | NetworkError
    | UnhandledException;
