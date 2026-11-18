import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupStepperDemo from './SignupStepperDemo';

const stepStatus = () =>
    screen.getAllByRole('listitem').map((item) => item.dataset.status);

describe('SignupStepperDemo', () => {
    it('stays on a step until its fields are valid', async () => {
        const user = userEvent.setup();
        render(<SignupStepperDemo />);

        await user.click(screen.getByRole('button', { name: 'Next' }));

        expect(await screen.findByText('Enter a valid email')).toBeVisible();
        expect(stepStatus()).toEqual(['error', 'upcoming', 'upcoming']);
    });

    it('walks through every step and submits', async () => {
        const user = userEvent.setup();
        render(<SignupStepperDemo />);

        await user.type(screen.getByLabelText(/Email/), 'sara@example.com');
        await user.type(screen.getByLabelText(/Password/), 'secret-pass');
        await user.click(screen.getByRole('button', { name: 'Next' }));

        await user.type(await screen.findByLabelText(/Full name/), 'Sara');
        await user.type(
            screen.getByLabelText(/Mobile number/),
            '+989121234567',
        );
        await user.click(screen.getByRole('button', { name: 'Next' }));

        await user.click(await screen.findByRole('radio', { name: /Pro/ }));
        await user.click(screen.getByRole('checkbox'));
        expect(stepStatus()).toEqual(['complete', 'complete', 'current']);

        await user.click(
            screen.getByRole('button', { name: 'Create account' }),
        );

        expect(
            await screen.findByText(/"mobile": "09121234567"/),
        ).toBeVisible();
    });

    it('goes back with the Back button and a completed step', async () => {
        const user = userEvent.setup();
        render(<SignupStepperDemo />);

        expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();

        await user.type(screen.getByLabelText(/Email/), 'sara@example.com');
        await user.type(screen.getByLabelText(/Password/), 'secret-pass');
        await user.click(screen.getByRole('button', { name: 'Next' }));
        await screen.findByLabelText(/Full name/);

        await user.click(screen.getByRole('button', { name: 'Back' }));
        expect(await screen.findByLabelText(/Email/)).toHaveValue(
            'sara@example.com',
        );

        await user.click(screen.getByRole('button', { name: 'Next' }));
        await user.click(
            await screen.findByRole('button', { name: /Account/ }),
        );
        expect(stepStatus()[0]).toBe('current');
    });
});
