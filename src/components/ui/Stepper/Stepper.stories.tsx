import SignupStepperDemo from '@/stories/helpers/stepper/SignupStepperDemo/SignupStepperDemo';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CreditCardIcon, PackageIcon, TruckIcon } from 'lucide-react';
import Stepper from '.';
import Button from '../Button';
import { useStepper } from './hooks/useStepper/useStepper';
import type { StepperProps, StepperStep } from './Stepper.types';

const STEPS: StepperStep[] = [
    { title: 'Cart', description: 'Review your items' },
    { title: 'Shipping', description: 'Where to send it' },
    { title: 'Payment', description: 'Card or wallet' },
    { title: 'Done' },
];

const meta: Meta<typeof Stepper> = {
    title: 'UI/Stepper',
    component: Stepper,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className="w-xl max-w-full">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        activeStep: { control: { type: 'number', min: 0, max: 3 } },
        orientation: {
            control: 'inline-radio',
            options: ['horizontal', 'vertical'],
        },
        linear: { control: 'boolean' },
    },
    args: { steps: STEPS, activeStep: 1 },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {};

export const Vertical: Story = {
    args: { orientation: 'vertical', activeStep: 2 },
};

export const WithIcons: Story = {
    args: {
        activeStep: 0,
        steps: [
            { title: 'Order', icon: <PackageIcon className="size-4" /> },
            { title: 'Shipping', icon: <TruckIcon className="size-4" /> },
            { title: 'Payment', icon: <CreditCardIcon className="size-4" /> },
        ],
    },
};

export const WithError: Story = {
    args: {
        activeStep: 2,
        steps: STEPS.map((step, index) =>
            index === 1
                ? { ...step, error: true, description: 'Address is missing' }
                : step,
        ),
    },
};

export const OptionalAndDisabled: Story = {
    args: {
        activeStep: 1,
        steps: [
            STEPS[0],
            { ...STEPS[1], optional: true },
            { ...STEPS[2], disabled: true },
            STEPS[3],
        ],
    },
};

const ClickableDemo = (args: Partial<StepperProps>) => {
    const { activeStep, isFirst, isLast, next, back, goTo } = useStepper({
        count: STEPS.length,
    });

    return (
        <div className="flex flex-col gap-8">
            <Stepper
                {...args}
                steps={STEPS}
                activeStep={activeStep}
                onStepClick={goTo}
            />
            <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={back} disabled={isFirst}>
                    Back
                </Button>
                <Button onClick={next} disabled={isLast}>
                    Next
                </Button>
            </div>
        </div>
    );
};

export const Clickable: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Passed steps can be clicked to go back to them.',
            },
        },
    },
    render: (args) => <ClickableDemo orientation={args.orientation} />,
};

export const NonLinear: Story = {
    parameters: {
        docs: {
            description: { story: 'Any step can be clicked, in any order.' },
        },
    },
    render: () => <ClickableDemo linear={false} />,
};

export const MultiStepForm: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Each step validates only its own fields (react-hook-form `trigger`) before moving on; a step with errors turns red.',
            },
        },
    },
    render: () => <SignupStepperDemo />,
};

export const RightToLeft: Story = {
    // Persian page: lang sets the Estedad font, dir the direction (also for portals).
    globals: { i18n: 'fa-IR' },
    render: (args) => (
        <div dir="rtl" className="flex flex-col gap-12">
            <Stepper {...args} />
            <Stepper {...args} orientation="vertical" />
        </div>
    ),
    args: {
        activeStep: 1,
        optionalLabel: 'اختیاری',
        completeLabel: 'انجام شد',
        errorLabel: 'خطا',
        'aria-label': 'مراحل خرید',
        steps: [
            { title: 'سبد خرید', description: 'بررسی کالاها' },
            { title: 'ارسال', description: 'آدرس تحویل', optional: true },
            { title: 'پرداخت', description: 'کارت یا کیف پول' },
            { title: 'پایان' },
        ],
    },
};
