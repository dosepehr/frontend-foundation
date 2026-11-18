import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Stepper from '.';
import type { StepperStep } from './Stepper.types';

const steps: StepperStep[] = [
    { title: 'Account', description: 'Email and password' },
    { title: 'Profile', optional: true },
    { title: 'Review' },
];

const items = () => screen.getAllByRole('listitem');

describe('Stepper', () => {
    it('renders an ordered list labelled "Progress" by default', () => {
        render(<Stepper steps={steps} activeStep={0} />);
        expect(screen.getByRole('list', { name: 'Progress' })).toBeVisible();
        expect(items()).toHaveLength(3);
    });

    it('uses a custom accessible name', () => {
        render(
            <Stepper
                steps={steps}
                activeStep={0}
                aria-label="Checkout steps"
            />,
        );
        expect(
            screen.getByRole('list', { name: 'Checkout steps' }),
        ).toBeVisible();
    });

    it('marks each step with its status', () => {
        render(<Stepper steps={steps} activeStep={1} />);
        expect(items().map((item) => item.dataset.status)).toEqual([
            'complete',
            'current',
            'upcoming',
        ]);
        expect(items()[1]).toHaveAttribute('aria-current', 'step');
        expect(items()[0]).not.toHaveAttribute('aria-current');
    });

    it('shows numbers for current and upcoming steps', () => {
        render(<Stepper steps={steps} activeStep={1} />);
        expect(items()[1]).toHaveTextContent('2');
        expect(items()[2]).toHaveTextContent('3');
    });

    it('shows a custom icon instead of the number', () => {
        render(
            <Stepper
                steps={[{ title: 'Pay', icon: <span data-testid="icon" /> }]}
                activeStep={0}
            />,
        );
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('announces completed and invalid steps', () => {
        render(
            <Stepper
                steps={[steps[0], { ...steps[1], error: true }, steps[2]]}
                activeStep={2}
                completeLabel="Done"
                errorLabel="Has errors"
            />,
        );
        expect(items()[0]).toHaveTextContent('Account (Done)');
        expect(items()[1]).toHaveTextContent('Profile (Has errors)');
        expect(items()[1].dataset.status).toBe('error');
    });

    it('shows descriptions and the optional label', () => {
        render(
            <Stepper steps={steps} activeStep={0} optionalLabel="اختیاری" />,
        );
        expect(screen.getByText('Email and password')).toBeInTheDocument();
        expect(screen.getByText('اختیاری')).toBeInTheDocument();
    });

    it('renders no buttons without onStepClick', () => {
        render(<Stepper steps={steps} activeStep={2} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('lets only passed steps be clicked in a linear stepper', async () => {
        const user = userEvent.setup();
        const onStepClick = vi.fn();
        render(
            <Stepper steps={steps} activeStep={1} onStepClick={onStepClick} />,
        );

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(1);

        await user.click(buttons[0]);
        expect(onStepClick).toHaveBeenCalledWith(0);
    });

    it('lets any other step be clicked in a non-linear stepper', async () => {
        const user = userEvent.setup();
        const onStepClick = vi.fn();
        render(
            <Stepper
                steps={steps}
                activeStep={1}
                linear={false}
                onStepClick={onStepClick}
            />,
        );

        await user.click(screen.getByRole('button', { name: /Review/ }));
        expect(onStepClick).toHaveBeenCalledWith(2);
    });

    it('never makes a disabled step clickable', () => {
        render(
            <Stepper
                steps={[{ title: 'A', disabled: true }, steps[1]]}
                activeStep={1}
                onStepClick={vi.fn()}
            />,
        );
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('marks a disabled step', () => {
        render(
            <Stepper
                steps={[steps[0], { ...steps[1], disabled: true }]}
                activeStep={0}
            />,
        );
        expect(items()[1]).toHaveAttribute('data-disabled', 'true');
        expect(items()[0]).not.toHaveAttribute('data-disabled');
    });

    it('draws a separator between steps only', () => {
        const { container } = render(<Stepper steps={steps} activeStep={0} />);
        expect(
            container.querySelectorAll('[data-slot=stepper-separator]'),
        ).toHaveLength(2);
    });

    it('sets the orientation', () => {
        render(<Stepper steps={steps} activeStep={0} orientation="vertical" />);
        expect(screen.getByRole('list')).toHaveAttribute(
            'data-orientation',
            'vertical',
        );
    });
});
