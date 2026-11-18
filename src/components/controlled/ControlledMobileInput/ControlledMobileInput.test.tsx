import { isValidMobile } from '@/components/ui/MobileInput/utils/mobile/mobile';
import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, useWatch } from 'react-hook-form';
import z from 'zod';
import { ControlledMobileInput } from '.';

const schema = z.object({
    mobile: z.string().refine(isValidMobile, 'Enter a valid mobile number'),
});
type TestForm = z.infer<typeof schema>;

function TestForm({
    defaultValues = { mobile: '' },
    onValueChange,
    onBlur,
    error,
}: {
    defaultValues?: TestForm;
    onValueChange?: (value: string) => void;
    onBlur?: () => void;
    error?: string;
}) {
    const { control, handleSubmit } = useForm<TestForm>({
        defaultValues,
        resolver: zodResolver(schema),
    });
    const mobileValue = useWatch({ control, name: 'mobile' });
    return (
        <form onSubmit={handleSubmit(() => {})}>
            <ControlledMobileInput
                name="mobile"
                control={control}
                label="Mobile number"
                onValueChange={onValueChange}
                onBlur={onBlur}
                error={error}
            />
            <output>{mobileValue}</output>
            <button type="submit">Submit</button>
        </form>
    );
}

const getInput = () => screen.getByRole('textbox', { name: 'Mobile number' });

describe('ControlledMobileInput', () => {
    it('shows the default value grouped', () => {
        render(<TestForm defaultValues={{ mobile: '09121234567' }} />);
        expect(getInput()).toHaveValue('0912 123 4567');
    });

    it('stores the normalized number and calls onValueChange', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<TestForm onValueChange={onValueChange} />);

        await user.type(getInput(), '+98 ۹۱۲ ۱۲۳ ۴۵۶۷');

        expect(screen.getByRole('status')).toHaveTextContent('09121234567');
        expect(onValueChange).toHaveBeenLastCalledWith('09121234567');
    });

    it('calls onBlur', async () => {
        const user = userEvent.setup();
        const onBlur = vi.fn();
        render(<TestForm onBlur={onBlur} />);

        await user.click(getInput());
        await user.tab();

        expect(onBlur).toHaveBeenCalled();
    });

    it('shows the schema error on submit', async () => {
        const user = userEvent.setup();
        render(<TestForm defaultValues={{ mobile: '0912' }} />);

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(
            await screen.findByText('Enter a valid mobile number'),
        ).toBeInTheDocument();
    });

    it('focuses the input when its field is invalid', async () => {
        const user = userEvent.setup();
        render(<TestForm />);

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(getInput()).toHaveFocus();
    });

    it('prefers the error prop', () => {
        render(<TestForm error="Already registered" />);
        expect(screen.getByText('Already registered')).toBeInTheDocument();
    });
});
