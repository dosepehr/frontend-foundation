import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AttachmentWrapper from '.';
import {
    Attachment,
    AttachmentAction,
    AttachmentActions,
    AttachmentContent,
    AttachmentDescription,
    AttachmentGroup,
    AttachmentMedia,
    AttachmentTitle,
    AttachmentTrigger,
} from './components';

describe('Attachment primitive', () => {
    it('has data-slot="attachment"', () => {
        const { container } = render(<Attachment />);
        expect(
            container.querySelector('[data-slot="attachment"]'),
        ).toBeInTheDocument();
    });

    it('defaults to state="done"', () => {
        const { container } = render(<Attachment />);
        expect(container.querySelector('[data-slot="attachment"]')).toHaveAttribute(
            'data-state',
            'done',
        );
    });

    it('reflects state via data-state', () => {
        const { container } = render(<Attachment state="error" />);
        expect(container.querySelector('[data-slot="attachment"]')).toHaveAttribute(
            'data-state',
            'error',
        );
    });

    it('reflects size via data-size', () => {
        const { container } = render(<Attachment size="sm" />);
        expect(container.querySelector('[data-slot="attachment"]')).toHaveAttribute(
            'data-size',
            'sm',
        );
    });

    it('reflects orientation via data-orientation', () => {
        const { container } = render(<Attachment orientation="vertical" />);
        expect(
            container.querySelector('[data-slot="attachment"]'),
        ).toHaveAttribute('data-orientation', 'vertical');
    });

    it('forwards className', () => {
        const { container } = render(<Attachment className="custom-class" />);
        expect(container.querySelector('[data-slot="attachment"]')).toHaveClass(
            'custom-class',
        );
    });

    it.each<'idle' | 'uploading' | 'processing' | 'error' | 'done'>([
        'idle', 'uploading', 'processing', 'error', 'done',
    ])(
        'renders state "%s" without errors',
        (state) => {
            const { container } = render(<Attachment state={state} />);
            expect(
                container.querySelector('[data-slot="attachment"]'),
            ).toHaveAttribute('data-state', state);
        },
    );

    it.each<'default' | 'sm' | 'xs'>(['default', 'sm', 'xs'])(
        'renders size "%s" without errors',
        (size) => {
            const { container } = render(<Attachment size={size} />);
            expect(
                container.querySelector('[data-slot="attachment"]'),
            ).toHaveAttribute('data-size', size);
        },
    );

    it.each<'horizontal' | 'vertical'>(['horizontal', 'vertical'])(
        'renders orientation "%s" without errors',
        (orientation) => {
            const { container } = render(<Attachment orientation={orientation} />);
            expect(
                container.querySelector('[data-slot="attachment"]'),
            ).toHaveAttribute('data-orientation', orientation);
        },
    );
});

describe('AttachmentMedia', () => {
    it('has data-slot="attachment-media"', () => {
        const { container } = render(<AttachmentMedia />);
        expect(
            container.querySelector('[data-slot="attachment-media"]'),
        ).toBeInTheDocument();
    });

    it('defaults to variant="icon"', () => {
        const { container } = render(<AttachmentMedia />);
        expect(
            container.querySelector('[data-slot="attachment-media"]'),
        ).toHaveAttribute('data-variant', 'icon');
    });

    it('reflects variant via data-variant', () => {
        const { container } = render(<AttachmentMedia variant="image" />);
        expect(
            container.querySelector('[data-slot="attachment-media"]'),
        ).toHaveAttribute('data-variant', 'image');
    });

    it('renders children', () => {
        render(<AttachmentMedia><span data-testid="icon" /></AttachmentMedia>);
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
});

describe('AttachmentContent', () => {
    it('has data-slot="attachment-content"', () => {
        const { container } = render(<AttachmentContent />);
        expect(
            container.querySelector('[data-slot="attachment-content"]'),
        ).toBeInTheDocument();
    });
});

describe('AttachmentTitle', () => {
    it('has data-slot="attachment-title"', () => {
        const { container } = render(<AttachmentTitle>file.pdf</AttachmentTitle>);
        expect(
            container.querySelector('[data-slot="attachment-title"]'),
        ).toBeInTheDocument();
    });

    it('renders text content', () => {
        render(<AttachmentTitle>file.pdf</AttachmentTitle>);
        expect(screen.getByText('file.pdf')).toBeInTheDocument();
    });
});

describe('AttachmentDescription', () => {
    it('has data-slot="attachment-description"', () => {
        const { container } = render(
            <AttachmentDescription>2.4 MB</AttachmentDescription>,
        );
        expect(
            container.querySelector('[data-slot="attachment-description"]'),
        ).toBeInTheDocument();
    });

    it('renders text content', () => {
        render(<AttachmentDescription>2.4 MB · PDF</AttachmentDescription>);
        expect(screen.getByText('2.4 MB · PDF')).toBeInTheDocument();
    });
});

describe('AttachmentActions', () => {
    it('has data-slot="attachment-actions"', () => {
        const { container } = render(<AttachmentActions />);
        expect(
            container.querySelector('[data-slot="attachment-actions"]'),
        ).toBeInTheDocument();
    });

    it('renders children', () => {
        render(
            <AttachmentActions>
                <button>Delete</button>
            </AttachmentActions>,
        );
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });
});

describe('AttachmentAction', () => {
    it('has data-slot="attachment-action"', () => {
        const { container } = render(<AttachmentAction>X</AttachmentAction>);
        expect(
            container.querySelector('[data-slot="attachment-action"]'),
        ).toBeInTheDocument();
    });

    it('renders as a button', () => {
        render(<AttachmentAction>Delete</AttachmentAction>);
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<AttachmentAction onClick={onClick}>X</AttachmentAction>);
        await user.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});

describe('AttachmentTrigger', () => {
    it('has data-slot="attachment-trigger"', () => {
        const { container } = render(<AttachmentTrigger />);
        expect(
            container.querySelector('[data-slot="attachment-trigger"]'),
        ).toBeInTheDocument();
    });

    it('renders as a button by default', () => {
        const { container } = render(<AttachmentTrigger />);
        expect(container.querySelector('button')).toBeInTheDocument();
    });
});

describe('AttachmentGroup', () => {
    it('has data-slot="attachment-group"', () => {
        const { container } = render(<AttachmentGroup />);
        expect(
            container.querySelector('[data-slot="attachment-group"]'),
        ).toBeInTheDocument();
    });

    it('renders children', () => {
        render(
            <AttachmentGroup>
                <span data-testid="child" />
            </AttachmentGroup>,
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });
});

describe('AttachmentWrapper', () => {
    it('renders the file name', () => {
        render(<AttachmentWrapper name="document.pdf" />);
        expect(screen.getByText('document.pdf')).toBeInTheDocument();
    });

    it('renders description when provided', () => {
        render(<AttachmentWrapper name="file.pdf" description="2.4 MB · PDF" />);
        expect(screen.getByText('2.4 MB · PDF')).toBeInTheDocument();
    });

    it('does not render description when omitted', () => {
        render(<AttachmentWrapper name="file.pdf" />);
        expect(
            document.querySelector('[data-slot="attachment-description"]'),
        ).not.toBeInTheDocument();
    });

    it('renders a default icon when no icon or imageSrc is provided', () => {
        const { container } = render(<AttachmentWrapper name="file.pdf" />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders a custom icon', () => {
        render(
            <AttachmentWrapper
                name="file.pdf"
                icon={<span data-testid="custom-icon" />}
            />,
        );
        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders an img when imageSrc is provided', () => {
        const { container } = render(
            <AttachmentWrapper name="photo.jpg" imageSrc="/img/photo.jpg" />,
        );
        const img = container.querySelector('img');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', '/img/photo.jpg');
    });

    it('uses imageAlt for the img alt attribute', () => {
        const { container } = render(
            <AttachmentWrapper
                name="photo.jpg"
                imageSrc="/img/photo.jpg"
                imageAlt="A photo"
            />,
        );
        expect(container.querySelector('img')).toHaveAttribute('alt', 'A photo');
    });

    it('falls back to name as img alt when imageAlt is omitted', () => {
        const { container } = render(
            <AttachmentWrapper name="photo.jpg" imageSrc="/img/photo.jpg" />,
        );
        expect(container.querySelector('img')).toHaveAttribute('alt', 'photo.jpg');
    });

    it('renders actions when provided', () => {
        render(
            <AttachmentWrapper
                name="file.pdf"
                actions={<button>Delete</button>}
            />,
        );
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('does not render AttachmentActions when actions is omitted', () => {
        render(<AttachmentWrapper name="file.pdf" />);
        expect(
            document.querySelector('[data-slot="attachment-actions"]'),
        ).not.toBeInTheDocument();
    });

    it('does not render a trigger when neither onPress nor href is provided', () => {
        render(<AttachmentWrapper name="file.pdf" />);
        expect(
            document.querySelector('[data-slot="attachment-trigger"]'),
        ).not.toBeInTheDocument();
    });

    it('renders a trigger button when onPress is provided', () => {
        render(<AttachmentWrapper name="file.pdf" onPress={() => {}} />);
        expect(
            document.querySelector('[data-slot="attachment-trigger"]'),
        ).toBeInTheDocument();
    });

    it('calls onPress when the trigger is clicked', async () => {
        const user = userEvent.setup();
        const onPress = vi.fn();
        const { container } = render(
            <AttachmentWrapper name="file.pdf" onPress={onPress} />,
        );
        await user.click(
            container.querySelector('[data-slot="attachment-trigger"]')!,
        );
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('renders a link trigger when href is provided', () => {
        const { container } = render(
            <AttachmentWrapper name="file.pdf" href="/files/doc.pdf" />,
        );
        const trigger = container.querySelector('[data-slot="attachment-trigger"]');
        expect(trigger).toBeInTheDocument();
        expect(trigger?.tagName).toBe('A');
        expect(trigger).toHaveAttribute('href', '/files/doc.pdf');
    });

    it('forwards state to the Attachment root', () => {
        const { container } = render(
            <AttachmentWrapper name="file.pdf" state="error" />,
        );
        expect(
            container.querySelector('[data-slot="attachment"]'),
        ).toHaveAttribute('data-state', 'error');
    });

    it('forwards size to the Attachment root', () => {
        const { container } = render(
            <AttachmentWrapper name="file.pdf" size="sm" />,
        );
        expect(
            container.querySelector('[data-slot="attachment"]'),
        ).toHaveAttribute('data-size', 'sm');
    });

    it('forwards orientation to the Attachment root', () => {
        const { container } = render(
            <AttachmentWrapper name="file.pdf" orientation="vertical" />,
        );
        expect(
            container.querySelector('[data-slot="attachment"]'),
        ).toHaveAttribute('data-orientation', 'vertical');
    });

    it('forwards className to the Attachment root', () => {
        const { container } = render(
            <AttachmentWrapper name="file.pdf" className="my-class" />,
        );
        expect(
            container.querySelector('[data-slot="attachment"]'),
        ).toHaveClass('my-class');
    });
});
