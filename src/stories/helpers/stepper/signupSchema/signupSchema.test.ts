import {
    SIGNUP_STEP_FIELDS,
    SIGNUP_STEPS,
    signupDefaults,
    signupSchema,
} from './signupSchema';

describe('signupSchema', () => {
    it('rejects the empty defaults', () => {
        expect(signupSchema.safeParse(signupDefaults).success).toBe(false);
    });

    it('accepts a complete signup', () => {
        expect(
            signupSchema.safeParse({
                email: 'a@b.co',
                password: '12345678',
                fullName: 'Sara',
                mobile: '09121234567',
                plan: 'pro',
                terms: true,
            }).success,
        ).toBe(true);
    });

    it('validates every field in exactly one step', () => {
        const fields = SIGNUP_STEP_FIELDS.flat();
        expect(SIGNUP_STEP_FIELDS).toHaveLength(SIGNUP_STEPS.length);
        expect(new Set(fields).size).toBe(fields.length);
        expect(fields.sort()).toEqual(Object.keys(signupDefaults).sort());
    });
});
