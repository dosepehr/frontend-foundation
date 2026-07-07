import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from './components';

function BasicMenu() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink href="#">Link</NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href="#">Item Two</NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

describe('NavigationMenu', () => {
    it('renders with data-slot', () => {
        const { container } = render(<BasicMenu />);
        expect(
            container.querySelector('[data-slot="navigation-menu"]'),
        ).toBeTruthy();
    });

    it('renders the trigger and static link', () => {
        render(<BasicMenu />);
        expect(screen.getByText('Item One')).toBeInTheDocument();
        expect(screen.getByText('Item Two')).toBeInTheDocument();
    });

    it('does not render popup content before the trigger is activated', () => {
        render(<BasicMenu />);
        expect(screen.queryByText('Link')).not.toBeInTheDocument();
    });

    it('opens the content on trigger click', async () => {
        const user = userEvent.setup();
        render(<BasicMenu />);
        await user.click(screen.getByText('Item One'));
        expect(await screen.findByText('Link')).toBeInTheDocument();
    });

    it('sets data-popup-open on the trigger when its content is open', async () => {
        const user = userEvent.setup();
        const { container } = render(<BasicMenu />);
        await user.click(screen.getByText('Item One'));
        await screen.findByText('Link');
        expect(
            container.querySelector(
                '[data-slot="navigation-menu-trigger"][data-popup-open]',
            ),
        ).toBeTruthy();
    });

    it('closes the content when the trigger is clicked again', async () => {
        const user = userEvent.setup();
        render(<BasicMenu />);
        await user.click(screen.getByText('Item One'));
        await screen.findByText('Link');
        await user.click(screen.getByText('Item One'));
        expect(screen.queryByText('Link')).not.toBeInTheDocument();
    });
});

describe('NavigationMenuList', () => {
    it('renders with data-slot', () => {
        const { container } = render(<BasicMenu />);
        expect(
            container.querySelector('[data-slot="navigation-menu-list"]'),
        ).toBeTruthy();
    });

    it('renders as a ul element', () => {
        const { container } = render(<BasicMenu />);
        expect(
            container.querySelector('ul[data-slot="navigation-menu-list"]'),
        ).toBeTruthy();
    });
});

describe('NavigationMenuItem', () => {
    it('renders with data-slot', () => {
        const { container } = render(<BasicMenu />);
        expect(
            container.querySelectorAll('[data-slot="navigation-menu-item"]')
                .length,
        ).toBe(2);
    });

    it('renders as an li element', () => {
        const { container } = render(<BasicMenu />);
        expect(
            container.querySelector('li[data-slot="navigation-menu-item"]'),
        ).toBeTruthy();
    });
});

describe('NavigationMenuTrigger', () => {
    it('renders with data-slot', () => {
        const { container } = render(<BasicMenu />);
        expect(
            container.querySelector('[data-slot="navigation-menu-trigger"]'),
        ).toBeTruthy();
    });

    it('renders as a button element', () => {
        const { container } = render(<BasicMenu />);
        expect(
            container.querySelector(
                'button[data-slot="navigation-menu-trigger"]',
            ),
        ).toBeTruthy();
    });

    it('has aria-expanded="false" before activation', () => {
        render(<BasicMenu />);
        expect(screen.getByText('Item One').closest('button')).toHaveAttribute(
            'aria-expanded',
            'false',
        );
    });

    it('sets aria-expanded="true" once opened', async () => {
        const user = userEvent.setup();
        render(<BasicMenu />);
        await user.click(screen.getByText('Item One'));
        await screen.findByText('Link');
        expect(screen.getByText('Item One').closest('button')).toHaveAttribute(
            'aria-expanded',
            'true',
        );
    });
});

describe('NavigationMenuContent', () => {
    it('renders with data-slot once open', async () => {
        const user = userEvent.setup();
        render(<BasicMenu />);
        await user.click(screen.getByText('Item One'));
        await screen.findByText('Link');
        expect(
            document.querySelector('[data-slot="navigation-menu-content"]'),
        ).toBeTruthy();
    });
});

describe('NavigationMenuLink', () => {
    it('renders with data-slot', () => {
        const { container } = render(<BasicMenu />);
        expect(
            container.querySelector('[data-slot="navigation-menu-link"]'),
        ).toBeTruthy();
    });

    it('renders as an anchor element', () => {
        const { container } = render(<BasicMenu />);
        expect(
            container.querySelector('a[data-slot="navigation-menu-link"]'),
        ).toBeTruthy();
    });

    it('does not set data-active by default', () => {
        const { container } = render(<BasicMenu />);
        const link = container.querySelector(
            '[data-slot="navigation-menu-link"]',
        );
        expect(link?.hasAttribute('data-active')).toBe(false);
    });

    it('sets data-active when active is true', () => {
        render(
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="#" active>
                            Active Link
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>,
        );
        expect(
            screen.getByText('Active Link').hasAttribute('data-active'),
        ).toBe(true);
    });

    it('sets aria-current="page" when active is true', () => {
        render(
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="#" active>
                            Active Link
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>,
        );
        expect(
            screen.getByText('Active Link').getAttribute('aria-current'),
        ).toBe('page');
    });

    it('renders via the render prop as a custom element', () => {
        render(
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            render={<a href="/docs" data-custom-link="" />}
                        >
                            Documentation
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>,
        );
        const link = screen.getByText('Documentation');
        expect(link.getAttribute('data-custom-link')).toBe('');
        expect(link.getAttribute('href')).toBe('/docs');
    });
});
