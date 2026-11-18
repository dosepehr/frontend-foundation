import { isValidMobile } from '@/components/ui/MobileInput/utils/mobile/mobile';
import z from 'zod';

export const signupSchema = z.object({
    email: z.email('Enter a valid email'),
    password: z.string().min(8, 'Use at least 8 characters'),
    fullName: z.string().min(2, 'Enter the full name'),
    mobile: z.string().refine(isValidMobile, 'Enter a valid mobile number'),
    plan: z.string().min(1, 'Select a plan'),
    terms: z.boolean().refine(Boolean, 'Accept the terms to continue'),
});

export type SignupDTO = z.infer<typeof signupSchema>;

export const signupDefaults: SignupDTO = {
    email: '',
    password: '',
    fullName: '',
    mobile: '',
    plan: '',
    terms: false,
};

/** Fields validated before leaving each step, in step order. */
export const SIGNUP_STEP_FIELDS: (keyof SignupDTO)[][] = [
    ['email', 'password'],
    ['fullName', 'mobile'],
    ['plan', 'terms'],
];

export const SIGNUP_STEPS = [
    { title: 'Account', description: 'Email and password' },
    { title: 'Profile', description: 'Name and mobile' },
    { title: 'Plan', description: 'Choose and confirm' },
];

export const PLAN_OPTIONS = [
    { label: 'Free', value: 'free', description: 'For trying things out' },
    { label: 'Pro', value: 'pro', description: 'For growing teams' },
];
