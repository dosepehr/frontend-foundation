import { mapErrorToToast } from '@/utils/api/client/mapErrorToToast';
import type { AxiosError, AxiosInstance } from 'axios';

export const globalErrorHandler = (client: AxiosInstance) => {
    client.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            mapErrorToToast(error);
            return Promise.reject(error);
        },
    );
};
