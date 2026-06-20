import { http, HttpResponse } from 'msw';

export const authHandlers = [
    http.post('/auth/login', () =>
        HttpResponse.json({
            status: true,
            data: {
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
            },
        }),
    ),

    http.post('/auth/register', () =>
        HttpResponse.json({ status: true, message: 'Registration successful.' }, { status: 201 }),
    ),

    http.post('/auth/refresh', () =>
        HttpResponse.json({
            status: true,
            data: {
                accessToken: 'mock-refreshed-access-token',
                refreshToken: 'mock-refreshed-refresh-token',
            },
        }),
    ),

    http.post('/auth/logout', () => HttpResponse.json({ status: true })),
];
