import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from './components';
import AccordionWrapper from './index';

describe('Accordion primitives', () => {
    it('renders trigger text', () => {
        render(
            <Accordion type="single">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Trigger text</AccordionTrigger>
                    <AccordionContent>Content text</AccordionContent>
                </AccordionItem>
            </Accordion>,
        );
        expect(screen.getByText('Trigger text')).toBeInTheDocument();
    });

    it('content is hidden by default', () => {
        render(
            <Accordion type="single">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Trigger</AccordionTrigger>
                    <AccordionContent>Hidden content</AccordionContent>
                </AccordionItem>
            </Accordion>,
        );
        // Radix sets hidden attribute on closed content — not present in the accessible tree
        expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });

    it('clicking trigger opens content', async () => {
        const user = userEvent.setup();
        render(
            <Accordion type="single">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Trigger</AccordionTrigger>
                    <AccordionContent>Revealed content</AccordionContent>
                </AccordionItem>
            </Accordion>,
        );
        await user.click(screen.getByText('Trigger'));
        expect(screen.getByRole('region')).toBeInTheDocument();
        expect(screen.getByText('Revealed content')).toBeInTheDocument();
    });

    it('collapsible: clicking open trigger closes it', async () => {
        const user = userEvent.setup();
        render(
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Trigger</AccordionTrigger>
                    <AccordionContent>Content</AccordionContent>
                </AccordionItem>
            </Accordion>,
        );
        const trigger = screen.getByText('Trigger');
        await user.click(trigger);
        expect(
            screen.getByRole('button', { name: /trigger/i }),
        ).toHaveAttribute('aria-expanded', 'true');
        await user.click(trigger);
        expect(
            screen.getByRole('button', { name: /trigger/i }),
        ).toHaveAttribute('aria-expanded', 'false');
    });

    it('type=single: opening one item closes another', async () => {
        const user = userEvent.setup();
        render(
            <Accordion type="single">
                <AccordionItem value="item-1">
                    <AccordionTrigger>First</AccordionTrigger>
                    <AccordionContent>First content</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Second</AccordionTrigger>
                    <AccordionContent>Second content</AccordionContent>
                </AccordionItem>
            </Accordion>,
        );
        await user.click(screen.getByText('First'));
        // Only one region open (First)
        expect(screen.getAllByRole('region')).toHaveLength(1);
        expect(screen.getByText('First content')).toBeInTheDocument();

        await user.click(screen.getByText('Second'));
        // Still only one region open (Second), First collapsed
        expect(screen.getAllByRole('region')).toHaveLength(1);
        expect(screen.getByText('Second content')).toBeInTheDocument();
        expect(screen.queryByText('First content')).not.toBeInTheDocument();
    });

    it('type=multiple: multiple items can be open simultaneously', async () => {
        const user = userEvent.setup();
        render(
            <Accordion type="multiple">
                <AccordionItem value="item-1">
                    <AccordionTrigger>First</AccordionTrigger>
                    <AccordionContent>First content</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Second</AccordionTrigger>
                    <AccordionContent>Second content</AccordionContent>
                </AccordionItem>
            </Accordion>,
        );
        await user.click(screen.getByText('First'));
        await user.click(screen.getByText('Second'));
        expect(screen.getAllByRole('region')).toHaveLength(2);
        expect(screen.getByText('First content')).toBeInTheDocument();
        expect(screen.getByText('Second content')).toBeInTheDocument();
    });

    it('disabled item cannot be opened', async () => {
        const user = userEvent.setup();
        render(
            <Accordion type="single">
                <AccordionItem value="item-1" disabled>
                    <AccordionTrigger>Disabled trigger</AccordionTrigger>
                    <AccordionContent>Disabled content</AccordionContent>
                </AccordionItem>
            </Accordion>,
        );
        await user.click(screen.getByText('Disabled trigger'));
        expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });

    it('defaultValue opens the matching item on mount', () => {
        render(
            <Accordion type="single" defaultValue="item-1">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Trigger</AccordionTrigger>
                    <AccordionContent>Pre-opened content</AccordionContent>
                </AccordionItem>
            </Accordion>,
        );
        expect(screen.getByRole('region')).toBeInTheDocument();
        expect(screen.getByText('Pre-opened content')).toBeInTheDocument();
    });

    it('defaultValue item has aria-expanded="true"', () => {
        render(
            <Accordion type="single" defaultValue="item-1">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Trigger</AccordionTrigger>
                    <AccordionContent>Content</AccordionContent>
                </AccordionItem>
            </Accordion>,
        );
        expect(
            screen.getByRole('button', { name: /trigger/i }),
        ).toHaveAttribute('aria-expanded', 'true');
    });

    it('keyboard: Enter opens content', async () => {
        const user = userEvent.setup();
        render(
            <Accordion type="single">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Trigger</AccordionTrigger>
                    <AccordionContent>Keyboard content</AccordionContent>
                </AccordionItem>
            </Accordion>,
        );
        await user.tab();
        await user.keyboard('{Enter}');
        expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('keyboard: Space opens content', async () => {
        const user = userEvent.setup();
        render(
            <Accordion type="single">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Trigger</AccordionTrigger>
                    <AccordionContent>Keyboard content</AccordionContent>
                </AccordionItem>
            </Accordion>,
        );
        await user.tab();
        await user.keyboard(' ');
        expect(screen.getByRole('region')).toBeInTheDocument();
    });
});

describe('AccordionWrapper', () => {
    it('renders trigger text', () => {
        render(
            <Accordion type="single">
                <AccordionWrapper value="w-1" trigger="Wrapper trigger">
                    Wrapper content
                </AccordionWrapper>
            </Accordion>,
        );
        expect(screen.getByText('Wrapper trigger')).toBeInTheDocument();
    });

    it('opens on trigger click', async () => {
        const user = userEvent.setup();
        render(
            <Accordion type="single">
                <AccordionWrapper value="w-1" trigger="Click me">
                    Wrapper content
                </AccordionWrapper>
            </Accordion>,
        );
        await user.click(screen.getByText('Click me'));
        expect(screen.getByRole('region')).toBeInTheDocument();
        expect(screen.getByText('Wrapper content')).toBeInTheDocument();
    });

    it('disabled prop prevents opening', async () => {
        const user = userEvent.setup();
        render(
            <Accordion type="single">
                <AccordionWrapper value="w-1" trigger="Disabled" disabled>
                    Hidden content
                </AccordionWrapper>
            </Accordion>,
        );
        await user.click(screen.getByText('Disabled'));
        expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });

    it('trigger accepts ReactNode', () => {
        render(
            <Accordion type="single">
                <AccordionWrapper
                    value="w-1"
                    trigger={<span data-testid="custom-trigger">Custom</span>}
                >
                    Content
                </AccordionWrapper>
            </Accordion>,
        );
        expect(screen.getByTestId('custom-trigger')).toBeInTheDocument();
    });
});
