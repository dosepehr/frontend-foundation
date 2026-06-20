import type { AxiosInstance, AxiosError } from 'axios';
import { mapErrorToToast } from './mapErrorToToast';

export const globalErrorHandler = (client: AxiosInstance) => {
    client.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            mapErrorToToast(error);
            return Promise.reject(error);
        }
    );
};
