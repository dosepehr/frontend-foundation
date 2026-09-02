import { describe, expect, it } from 'vitest';
import type { ApiError } from '../types/DTO/http-errors.interface';
import {
    badRequestErrorStrategy,
    conflictErrorStrategy,
    errorHandler,
    networkErrorStrategy,
    notFoundErrorStrategy,
    unauthorizedErrorStrategy,
    unhandledExceptionStrategy,
    validationErrorStrategy,
} from './http-error-strategies';

const baseError = { status: false, message: 'original message' } as ApiError;

describe('http-error-strategies', () => {
    describe('badRequestErrorStrategy', () => {
        it('spreads the input error without changing the message', () => {
            expect(badRequestErrorStrategy(baseError)).toEqual({
                ...baseError,
            });
        });
    });

    describe('validationErrorStrategy', () => {
        it('spreads the input error without changing the message', () => {
            expect(validationErrorStrategy(baseError)).toEqual({
                ...baseError,
            });
        });
    });

    describe('notFoundErrorStrategy', () => {
        it('overrides the message with a not-found message', () => {
            expect(notFoundErrorStrategy(baseError)).toEqual({
                ...baseError,
                message: 'The requested resource was not found.',
            });
        });
    });

    describe('unauthorizedErrorStrategy', () => {
        it('overrides the message with an unauthorized message', () => {
            expect(unauthorizedErrorStrategy(baseError)).toEqual({
                ...baseError,
                message: 'Unauthorized. Please sign in again.',
            });
        });
    });

    describe('unhandledExceptionStrategy', () => {
        it('overrides the message with a generic server error message', () => {
            expect(unhandledExceptionStrategy(baseError)).toEqual({
                ...baseError,
                message: 'Server error. Please try again later.',
            });
        });
    });

    describe('conflictErrorStrategy', () => {
        it('overrides the message with a conflict message', () => {
            expect(conflictErrorStrategy(baseError)).toEqual({
                ...baseError,
                message: 'Conflict. Please try again.',
            });
        });
    });

    describe('networkErrorStrategy', () => {
        it('returns a network error message without needing any input', () => {
            expect(networkErrorStrategy()).toEqual({
                message:
                    'Network error. Please check your internet connection.',
            });
        });
    });

    describe('errorHandler', () => {
        it('picks validationErrorStrategy for 400 when errorData.message is truthy', () => {
            const errorData = { ...baseError, message: 'field is required' };
            expect(errorHandler[400]?.(errorData)).toEqual(
                validationErrorStrategy(errorData),
            );
        });

        it('picks badRequestErrorStrategy for 400 when errorData.message is falsy', () => {
            const errorData = { ...baseError, message: '' };
            expect(errorHandler[400]?.(errorData)).toEqual(
                badRequestErrorStrategy(errorData),
            );
        });

        it('wires 401 to unauthorizedErrorStrategy', () => {
            expect(errorHandler[401]?.(baseError).message).toBe(
                'Unauthorized. Please sign in again.',
            );
        });

        it('wires 403 to unauthorizedErrorStrategy', () => {
            expect(errorHandler[403]?.(baseError).message).toBe(
                'Unauthorized. Please sign in again.',
            );
        });

        it('wires 404 to notFoundErrorStrategy', () => {
            expect(errorHandler[404]?.(baseError).message).toBe(
                'The requested resource was not found.',
            );
        });

        it('wires 409 to conflictErrorStrategy', () => {
            expect(errorHandler[409]?.(baseError).message).toBe(
                'Conflict. Please try again.',
            );
        });

        it('wires 422 to badRequestErrorStrategy', () => {
            expect(errorHandler[422]?.(baseError).message).toBe(
                baseError.message,
            );
        });

        it('wires 500 to unhandledExceptionStrategy', () => {
            expect(errorHandler[500]?.(baseError).message).toBe(
                'Server error. Please try again later.',
            );
        });

        it('has no entry for unmapped status codes', () => {
            expect(errorHandler[418]).toBeUndefined();
        });
    });
});
