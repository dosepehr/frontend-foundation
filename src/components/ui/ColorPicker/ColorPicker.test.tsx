import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import ColorPicker from '.';

const trigger = () => screen.getAllByRole('button')[0];
const open = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(trigger());
};

function Controlled({ initial = '#ff0000' }: { initial?: string }) {
    const [value, setValue] = useState(initial);
    return (
        <>
            <ColorPicker value={value} onValueChange={setValue} />
            <span data-testid="value">{value}</span>
        </>
    );
}

describe('ColorPicker — trigger', () => {
    it('shows the color and its hex', () => {
        const { container } = render(<ColorPicker defaultValue="#3366FF" />);
        expect(trigger()).toHaveTextContent('#3366ff');
        expect(
            container.querySelector('[data-slot="color-preview"]'),
        ).toHaveStyle({
            backgroundColor: '#3366ff',
        });
    });

    it('renders the label, description and error', () => {
        render(
            <ColorPicker
                label="Brand color"
                description="Used for buttons"
                error="Too light"
            />,
        );
        expect(screen.getByLabelText('Brand color')).toBe(trigger());
        expect(screen.getByText('Used for buttons')).toBeInTheDocument();
        expect(screen.getByText('Too light')).toBeInTheDocument();
        expect(trigger()).toHaveAttribute('aria-invalid', 'true');
    });

    it('can be disabled', () => {
        render(<ColorPicker disabled />);
        expect(trigger()).toBeDisabled();
    });

    it('submits the hex through a hidden input', () => {
        const { container } = render(
            <ColorPicker name="color" defaultValue="#abc" />,
        );
        const hidden = container.querySelector('input[type="hidden"]');
        expect(hidden).toHaveAttribute('name', 'color');
        expect(hidden).toHaveValue('#aabbcc');
    });
});

describe('ColorPicker — panel', () => {
    it('shows the area, hue slider, fields and swatches', async () => {
        const user = userEvent.setup();
        render(<ColorPicker />);
        await open(user);

        expect(
            screen.getByRole('slider', { name: 'Saturation and brightness' }),
        ).toBeInTheDocument();
        expect(screen.getByRole('slider', { name: 'Hue' })).toBeInTheDocument();
        expect(
            screen.getByRole('textbox', { name: 'Hex' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('spinbutton', { name: 'Red' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('group', { name: 'Preset colors' }),
        ).toBeInTheDocument();
    });

    it('hides RGB fields and swatches on request', async () => {
        const user = userEvent.setup();
        render(<ColorPicker showRgb={false} presets={[]} />);
        await open(user);

        expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
        expect(
            screen.queryByRole('group', { name: 'Preset colors' }),
        ).not.toBeInTheDocument();
    });

    it('picks a preset', async () => {
        const user = userEvent.setup();
        render(<Controlled />);
        await open(user);

        const presets = within(
            screen.getByRole('group', { name: 'Preset colors' }),
        );
        await user.click(presets.getByRole('button', { name: '#3b82f6' }));

        expect(screen.getByTestId('value')).toHaveTextContent('#3b82f6');
        expect(
            presets.getByRole('button', { name: '#3b82f6' }),
        ).toHaveAttribute('aria-pressed', 'true');
    });

    it('applies a typed hex on Enter and restores an invalid one on blur', async () => {
        const user = userEvent.setup();
        render(<Controlled />);
        await open(user);
        const hex = screen.getByRole('textbox', { name: 'Hex' });

        await user.clear(hex);
        await user.type(hex, '#0F0{Enter}');
        expect(screen.getByTestId('value')).toHaveTextContent('#00ff00');

        await user.clear(hex);
        await user.type(hex, 'xyz');
        fireEvent.blur(hex);
        expect(hex).toHaveValue('00ff00');
    });

    it('edits an RGB channel', async () => {
        const user = userEvent.setup();
        render(<Controlled initial="#000000" />);
        await open(user);
        const blue = screen.getByRole('spinbutton', { name: 'Blue' });

        await user.clear(blue);
        await user.type(blue, '255');

        expect(screen.getByTestId('value')).toHaveTextContent('#0000ff');
        expect(blue).toHaveValue('255');
    });

    it('changes the hue with the keyboard', async () => {
        const user = userEvent.setup();
        render(<Controlled initial="#ff0000" />);
        await open(user);

        const hue = screen.getByRole('slider', { name: 'Hue' });
        hue.focus();
        await user.keyboard('{End}');

        expect(hue).toHaveAttribute('aria-valuenow', '360');
        expect(screen.getByTestId('value')).toHaveTextContent('#ff0000');
    });

    it('moves in the area with the keyboard', async () => {
        const user = userEvent.setup();
        render(<Controlled initial="#ff0000" />);
        await open(user);

        screen
            .getByRole('slider', { name: 'Saturation and brightness' })
            .focus();
        await user.keyboard('{Shift>}{ArrowDown}{/Shift}');

        expect(screen.getByTestId('value')).toHaveTextContent('#e60000');
    });

    it('shows the eyedropper only where supported', async () => {
        const user = userEvent.setup();
        const { unmount } = render(<ColorPicker />);
        await open(user);
        expect(
            screen.queryByRole('button', {
                name: 'Pick a color from the screen',
            }),
        ).not.toBeInTheDocument();
        unmount();

        vi.stubGlobal(
            'EyeDropper',
            class {
                open = () => Promise.resolve({ sRGBHex: '#123456' });
            },
        );
        render(<Controlled />);
        await open(user);
        await user.click(
            screen.getByRole('button', {
                name: 'Pick a color from the screen',
            }),
        );

        expect(screen.getByTestId('value')).toHaveTextContent('#123456');
        vi.unstubAllGlobals();
    });

    it('hides the eyedropper with showEyeDropper={false}', async () => {
        vi.stubGlobal('EyeDropper', class {});
        const user = userEvent.setup();
        render(<ColorPicker showEyeDropper={false} />);
        await open(user);

        expect(
            screen.queryByRole('button', {
                name: 'Pick a color from the screen',
            }),
        ).not.toBeInTheDocument();
        vi.unstubAllGlobals();
    });
});
