'use client';

import { ControlledCheckbox } from '@/components/controlled/ControlledCheckbox';
import { ControlledMobileInput } from '@/components/controlled/ControlledMobileInput';
import { ControlledRadioGroup } from '@/components/controlled/ControlledRadioGroup';
import Button from '@/components/ui/Button';
import { FieldGroup } from '@/components/ui/Field';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Stepper from '@/components/ui/Stepper';
import { useStepper } from '@/components/ui/Stepper/hooks/useStepper/useStepper';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    PLAN_OPTIONS,
    SIGNUP_STEP_FIELDS,
    SIGNUP_STEPS,
    signupDefaults,
    signupSchema,
    type SignupDTO,
} from '../signupSchema/signupSchema';

// Three-step signup: each step validates only its own fields before moving
// on, and a step with errors is marked in the stepper.
const SignupStepperDemo = () => {
    const { activeStep, isFirst, isLast, next, back, goTo } = useStepper({
        count: SIGNUP_STEPS.length,
    });
    const [submitted, setSubmitted] = useState<SignupDTO | null>(null);
    const {
        register,
        control,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm<SignupDTO>({
        defaultValues: signupDefaults,
        resolver: zodResolver(signupSchema),
    });

    const steps = SIGNUP_STEPS.map((step, index) => ({
        ...step,
        error: SIGNUP_STEP_FIELDS[index].some((field) => errors[field]),
    }));

    const onNext = async () => {
        if (await trigger(SIGNUP_STEP_FIELDS[activeStep])) next();
    };

    const onSubmit = (values: SignupDTO) => setSubmitted(values);

    return (
        <div className="flex w-full max-w-xl flex-col gap-8">
            <Stepper steps={steps} activeStep={activeStep} onStepClick={goTo} />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-8"
                noValidate
            >
                <FieldGroup>
                    {activeStep === 0 && (
                        <>
                            <Input
                                label="Email"
                                type="email"
                                placeholder="Enter the email"
                                required
                                error={errors.email?.message}
                                {...register('email')}
                            />
                            <PasswordInput
                                label="Password"
                                placeholder="Enter the password"
                                required
                                error={errors.password?.message}
                                {...register('password')}
                            />
                        </>
                    )}
                    {activeStep === 1 && (
                        <>
                            <Input
                                label="Full name"
                                placeholder="Enter the full name"
                                required
                                error={errors.fullName?.message}
                                {...register('fullName')}
                            />
                            <ControlledMobileInput
                                name="mobile"
                                control={control}
                                label="Mobile number"
                                placeholder="Enter the mobile number"
                                required
                            />
                        </>
                    )}
                    {activeStep === 2 && (
                        <>
                            <ControlledRadioGroup
                                name="plan"
                                control={control}
                                label="Plan"
                                options={PLAN_OPTIONS}
                                required
                            />
                            <ControlledCheckbox
                                name="terms"
                                control={control}
                                label="I accept the terms"
                                required
                            />
                        </>
                    )}
                </FieldGroup>
                <div className="flex justify-between gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={back}
                        disabled={isFirst}
                    >
                        Back
                    </Button>
                    {isLast ? (
                        <Button type="submit">Create account</Button>
                    ) : (
                        <Button type="button" onClick={onNext}>
                            Next
                        </Button>
                    )}
                </div>
            </form>
            {submitted && (
                <pre className="rounded-md bg-muted p-3 text-xs">
                    {JSON.stringify(submitted, null, 2)}
                </pre>
            )}
        </div>
    );
};

export default SignupStepperDemo;
