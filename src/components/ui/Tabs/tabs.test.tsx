import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components';

describe('Tabs', () => {
    it('has data-slot="tabs"', () => {
        const { container } = render(
            <Tabs defaultValue="a">
                <TabsList>
                    <TabsTrigger value="a">A</TabsTrigger>
                </TabsList>
                <TabsContent value="a">Content A</TabsContent>
            </Tabs>,
        );
        expect(
            container.querySelector('[data-slot="tabs"]'),
        ).toBeInTheDocument();
    });

    it('renders tab triggers', () => {
        render(
            <Tabs defaultValue="a">
                <TabsList>
                    <TabsTrigger value="a">Tab A</TabsTrigger>
                    <TabsTrigger value="b">Tab B</TabsTrigger>
                </TabsList>
            </Tabs>,
        );
        expect(screen.getByText('Tab A')).toBeInTheDocument();
        expect(screen.getByText('Tab B')).toBeInTheDocument();
    });

    it('shows content for the active tab', () => {
        render(
            <Tabs defaultValue="a">
                <TabsList>
                    <TabsTrigger value="a">Tab A</TabsTrigger>
                    <TabsTrigger value="b">Tab B</TabsTrigger>
                </TabsList>
                <TabsContent value="a">Content A</TabsContent>
                <TabsContent value="b">Content B</TabsContent>
            </Tabs>,
        );
        expect(screen.getByText('Content A')).toBeInTheDocument();
    });

    it('switches content when a tab is clicked', async () => {
        const user = userEvent.setup();
        render(
            <Tabs defaultValue="a">
                <TabsList>
                    <TabsTrigger value="a">Tab A</TabsTrigger>
                    <TabsTrigger value="b">Tab B</TabsTrigger>
                </TabsList>
                <TabsContent value="a">Content A</TabsContent>
                <TabsContent value="b">Content B</TabsContent>
            </Tabs>,
        );
        await user.click(screen.getByText('Tab B'));
        expect(screen.getByText('Content B')).toBeInTheDocument();
    });

    it('active trigger has data-state="active"', () => {
        render(
            <Tabs defaultValue="a">
                <TabsList>
                    <TabsTrigger value="a">Tab A</TabsTrigger>
                </TabsList>
            </Tabs>,
        );
        expect(screen.getByText('Tab A')).toHaveAttribute(
            'data-state',
            'active',
        );
    });

    it('inactive trigger has data-state="inactive"', () => {
        render(
            <Tabs defaultValue="a">
                <TabsList>
                    <TabsTrigger value="a">Tab A</TabsTrigger>
                    <TabsTrigger value="b">Tab B</TabsTrigger>
                </TabsList>
            </Tabs>,
        );
        expect(screen.getByText('Tab B')).toHaveAttribute(
            'data-state',
            'inactive',
        );
    });

    it('has data-slot="tabs-list" on the list', () => {
        const { container } = render(
            <Tabs defaultValue="a">
                <TabsList>
                    <TabsTrigger value="a">A</TabsTrigger>
                </TabsList>
            </Tabs>,
        );
        expect(
            container.querySelector('[data-slot="tabs-list"]'),
        ).toBeInTheDocument();
    });

    it('has data-slot="tabs-trigger" on trigger', () => {
        const { container } = render(
            <Tabs defaultValue="a">
                <TabsList>
                    <TabsTrigger value="a">A</TabsTrigger>
                </TabsList>
            </Tabs>,
        );
        expect(
            container.querySelector('[data-slot="tabs-trigger"]'),
        ).toBeInTheDocument();
    });

    it('has data-slot="tabs-content" on content', () => {
        const { container } = render(
            <Tabs defaultValue="a">
                <TabsList>
                    <TabsTrigger value="a">A</TabsTrigger>
                </TabsList>
                <TabsContent value="a">Content</TabsContent>
            </Tabs>,
        );
        expect(
            container.querySelector('[data-slot="tabs-content"]'),
        ).toBeInTheDocument();
    });

    it('calls onValueChange when tab is clicked', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(
            <Tabs defaultValue="a" onValueChange={onValueChange}>
                <TabsList>
                    <TabsTrigger value="a">Tab A</TabsTrigger>
                    <TabsTrigger value="b">Tab B</TabsTrigger>
                </TabsList>
            </Tabs>,
        );
        await user.click(screen.getByText('Tab B'));
        expect(onValueChange).toHaveBeenCalledWith('b');
    });

    it('forwards className to Tabs', () => {
        const { container } = render(
            <Tabs defaultValue="a" className="custom-tabs">
                <TabsList>
                    <TabsTrigger value="a">A</TabsTrigger>
                </TabsList>
            </Tabs>,
        );
        expect(container.querySelector('[data-slot="tabs"]')).toHaveClass(
            'custom-tabs',
        );
    });
});
