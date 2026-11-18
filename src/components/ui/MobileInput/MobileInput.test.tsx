import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileInput from '.';

const getInput = () => screen.getByRole<HTMLInputElement>('textbox');

describe('MobileInput', () => {
    it('renders a tel input', () => {
        render(<MobileInput />);
        expect(getInput()).toHaveAttribute('type', 'tel');
        expect(getInput()).toHaveAttribute('inputmode', 'tel');
    });

    it('keeps the page direction while empty, for the placeholder', () => {
        render(<MobileInput placeholder="شماره موبایل را وارد کنید" />);
        expect(getInput()).not.toHaveAttribute('dir');
    });

    it('shows a typed number left to right', async () => {
        const user = userEvent.setup();
        render(<MobileInput />);

        await user.type(getInput(), '۰۹۱۲');
        expect(getInput()).toHaveAttribute('dir', 'ltr');

        await user.clear(getInput());
        expect(getInput()).not.toHaveAttribute('dir');
    });

    it('keeps a custom class', () => {
        render(<MobileInput className="font-mono" />);
        expect(getInput()).toHaveClass('font-mono', 'rtl:text-right');
    });

    it.each([
        ['English', '09121234567'],
        ['Persian', '۰۹۱۲۱۲۳۴۵۶۷'],
        ['Arabic', '٠٩١٢١٢٣٤٥٦٧'],
    ])('shows %s digits as English digits', async (_, digits) => {
        const user = userEvent.setup();
        render(<MobileInput />);

        await user.type(getInput(), digits);

        expect(getInput()).toHaveValue('09121234567');
    });

    it('reports the normalized number while typing', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<MobileInput onValueChange={onValueChange} />);

        await user.type(getInput(), '+989121234567');

        expect(getInput()).toHaveValue('+989121234567');
        expect(onValueChange).toHaveBeenLastCalledWith('09121234567');
    });

    it('converts Persian digits and regroups on blur', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<MobileInput onValueChange={onValueChange} />);

        await user.type(getInput(), '۹۱۲۱۲۳۴۵۶۷');
        await user.tab();

        expect(getInput()).toHaveValue('0912 123 4567');
        expect(onValueChange).toHaveBeenLastCalledWith('09121234567');
    });

    it('normalizes a pasted number', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<MobileInput onValueChange={onValueChange} />);

        await user.click(getInput());
        await user.paste('0098 912 123 4567');

        expect(onValueChange).toHaveBeenLastCalledWith('09121234567');
    });

    it('drops letters', async () => {
        const user = userEvent.setup();
        render(<MobileInput />);

        await user.type(getInput(), '09a12');

        expect(getInput()).toHaveValue('0912');
    });

    it('shows a controlled value formatted', () => {
        render(<MobileInput value="09121234567" />);
        expect(getInput()).toHaveValue('0912 123 4567');
    });

    it('passes label, error and onBlur through', async () => {
        const user = userEvent.setup();
        const onBlur = vi.fn();
        render(
            <MobileInput
                label="Mobile number"
                error="Enter a valid number"
                onBlur={onBlur}
            />,
        );

        expect(screen.getByLabelText('Mobile number')).toBe(getInput());
        expect(screen.getByRole('alert')).toHaveTextContent(
            'Enter a valid number',
        );

        await user.click(getInput());
        await user.tab();
        expect(onBlur).toHaveBeenCalled();
    });
});
