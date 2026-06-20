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

export const loginScenarios = {
    success: http.post('/auth/login', () =>
        HttpResponse.json({
            status: true,
            data: {
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
            },
        }),
    ),

    invalidCredentials: http.post('/auth/login', () =>
        HttpResponse.json({ message: 'Invalid email or password.' }, { status: 401 }),
    ),

    serverError: http.post('/auth/login', () =>
        HttpResponse.json({ message: 'Server error. Please try again later.' }, { status: 500 }),
    ),

    networkError: http.post('/auth/login', () => HttpResponse.error()),

    slowResponse: http.post('/auth/login', async () => {
        await new Promise((r) => setTimeout(r, 3000));
        return HttpResponse.json({
            status: true,
            data: {
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
            },
        });
    }),
};
