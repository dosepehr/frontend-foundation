// Success envelope returned by the API, with optional pagination metadata.

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface SuccessResponse<T = undefined> {
    status: boolean;
    message?: string;
    data?: T;
    meta?: PaginationMeta;
}
