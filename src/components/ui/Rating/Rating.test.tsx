import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeartIcon } from 'lucide-react';
import { useState } from 'react';
import Rating from '.';

const fills = (container: HTMLElement) =>
    [...container.querySelectorAll('[data-fill]')].map((star) =>
        Number(star.getAttribute('data-fill')),
    );

describe('Rating', () => {
    it('renders five stars by default', () => {
        const { container } = render(<Rating />);
        expect(fills(container)).toEqual([0, 0, 0, 0, 0]);
    });

    it('renders a custom number of stars', () => {
        const { container } = render(<Rating max={10} />);
        expect(fills(container)).toHaveLength(10);
    });

    it('fills stars up to the value, including halves', () => {
        const { container } = render(<Rating defaultValue={3.5} />);
        expect(fills(container)).toEqual([1, 1, 1, 0.5, 0]);
    });

    it('exposes an accessible slider', () => {
        render(<Rating defaultValue={3} label="Quality" required />);
        const slider = screen.getByRole('slider', { name: 'Quality' });
        expect(slider).toHaveAttribute('tabindex', '0');
        expect(slider).toHaveAttribute('aria-valuenow', '3');
        expect(slider).toHaveAttribute('aria-valuemax', '5');
        expect(slider).toHaveAttribute('aria-valuetext', '3 out of 5');
        expect(slider).toHaveAttribute('aria-required', 'true');
    });

    it('uses an aria-label without a visible label', () => {
        render(<Rating aria-label="Service" />);
        expect(
            screen.getByRole('slider', { name: 'Service' }),
        ).toBeInTheDocument();
    });

    it('falls back to "Rating" as its name', () => {
        render(<Rating />);
        expect(
            screen.getByRole('slider', { name: 'Rating' }),
        ).toBeInTheDocument();
    });

    it('selects a star on click', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        const { container } = render(<Rating onValueChange={onValueChange} />);
        const stars = container.querySelectorAll('[data-slot="rating"] > span');

        await user.click(stars[2]);

        expect(onValueChange).toHaveBeenCalledWith(3);
        expect(fills(container)).toEqual([1, 1, 1, 0, 0]);
    });

    it('changes with the keyboard', async () => {
        const user = userEvent.setup();
        render(<Rating defaultValue={2} />);
        const slider = screen.getByRole('slider');

        slider.focus();
        await user.keyboard('{ArrowRight}{ArrowRight}');

        expect(slider).toHaveAttribute('aria-valuenow', '4');
    });

    it('previews on hover and restores on leave', () => {
        const { container } = render(<Rating defaultValue={1} />);
        const stars = container.querySelectorAll('[data-slot="rating"] > span');

        fireEvent.pointerMove(stars[3], { clientX: 0 });
        expect(fills(container)).toEqual([1, 1, 1, 1, 0]);

        fireEvent.pointerLeave(screen.getByRole('slider'));
        expect(fills(container)).toEqual([1, 0, 0, 0, 0]);
    });

    it('is a read-only image when readOnly', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        const { container } = render(
            <Rating
                defaultValue={4.3}
                readOnly
                label="Average"
                onValueChange={onValueChange}
            />,
        );

        const image = screen.getByRole('img', {
            name: 'Average: 4.3 out of 5',
        });
        expect(image).not.toHaveAttribute('tabindex');
        expect(fills(container)[4]).toBeCloseTo(0.3);

        await user.click(
            container.querySelectorAll('[data-slot="rating"] > span')[0],
        );
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it('is disabled', () => {
        render(<Rating defaultValue={2} disabled />);
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('aria-disabled', 'true');
        expect(image).toHaveClass('opacity-50');
    });

    it('renders the label, description and error', () => {
        render(
            <Rating
                label="Food"
                description="How was it?"
                error="Please rate"
            />,
        );
        expect(screen.getByText('How was it?')).toBeInTheDocument();
        expect(screen.getByText('Please rate')).toBeInTheDocument();
        expect(screen.getByRole('slider')).toHaveAttribute(
            'aria-invalid',
            'true',
        );
    });

    it('uses a custom icon', () => {
        render(<Rating icon={<HeartIcon data-testid="heart" />} max={3} />);
        // Each star renders the icon twice: the outline and the clipped fill.
        expect(screen.getAllByTestId('heart')).toHaveLength(6);
    });

    it('submits the value through a hidden input', () => {
        const { container } = render(<Rating name="score" defaultValue={4} />);
        const hidden = container.querySelector('input[type="hidden"]');
        expect(hidden).toHaveAttribute('name', 'score');
        expect(hidden).toHaveValue('4');
    });

    it('works as a controlled input', async () => {
        const user = userEvent.setup();
        function Controlled() {
            const [value, setValue] = useState(1);
            return (
                <>
                    <Rating value={value} onValueChange={setValue} />
                    <output>{value}</output>
                </>
            );
        }
        render(<Controlled />);

        screen.getByRole('slider').focus();
        await user.keyboard('{End}');

        expect(screen.getByRole('status')).toHaveTextContent('5');
    });
});
