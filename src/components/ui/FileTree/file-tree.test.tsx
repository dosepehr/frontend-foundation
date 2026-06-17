import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileTree } from './components';
import type { FileTreeItem } from './file-tree.types';

const ITEMS: FileTreeItem[] = [
    { name: 'README.md' },
    {
        name: 'src',
        items: [
            { name: 'index.ts' },
            {
                name: 'components',
                items: [
                    { name: 'Button.tsx' },
                ],
            },
        ],
    },
];

describe('FileTree', () => {
    it('renders file names', () => {
        render(<FileTree items={ITEMS} />);
        expect(screen.getByText('README.md')).toBeInTheDocument();
    });

    it('renders root folder name', () => {
        render(<FileTree items={ITEMS} />);
        expect(screen.getByText('src')).toBeInTheDocument();
    });

    it('root folder is open by default (depth 0)', () => {
        render(<FileTree items={ITEMS} />);
        expect(screen.getByText('index.ts')).toBeInTheDocument();
    });

    it('nested folder is closed by default (depth > 0)', () => {
        render(<FileTree items={ITEMS} />);
        expect(screen.queryByText('Button.tsx')).not.toBeInTheDocument();
    });

    it('opens a nested folder on click', async () => {
        const user = userEvent.setup();
        render(<FileTree items={ITEMS} />);
        await user.click(screen.getByText('components'));
        expect(screen.getByText('Button.tsx')).toBeInTheDocument();
    });

    it('closes an open folder on second click', async () => {
        const user = userEvent.setup();
        render(<FileTree items={ITEMS} />);
        // src is open by default — click to close
        await user.click(screen.getByText('src'));
        const root = screen.getByText('src').closest('[data-slot="collapsible"]');
        expect(root).toHaveAttribute('data-state', 'closed');
    });

    it('renders custom icon for a file', () => {
        const items: FileTreeItem[] = [
            { name: 'config.json', icon: <span data-testid='custom-icon' /> },
        ];
        render(<FileTree items={items} />);
        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders custom icon for a folder', () => {
        const items: FileTreeItem[] = [
            { name: 'assets', icon: <span data-testid='folder-icon' />, items: [] },
        ];
        render(<FileTree items={items} />);
        expect(screen.getByTestId('folder-icon')).toBeInTheDocument();
    });

    it('forwards className to the root container', () => {
        const { container } = render(<FileTree items={ITEMS} className='custom-tree' />);
        expect(container.firstChild).toHaveClass('custom-tree');
    });

    it('renders an empty tree without errors', () => {
        expect(() => render(<FileTree items={[]} />)).not.toThrow();
    });

    it('renders multiple root-level files', () => {
        const items: FileTreeItem[] = [
            { name: 'a.ts' },
            { name: 'b.ts' },
            { name: 'c.ts' },
        ];
        render(<FileTree items={items} />);
        expect(screen.getByText('a.ts')).toBeInTheDocument();
        expect(screen.getByText('b.ts')).toBeInTheDocument();
        expect(screen.getByText('c.ts')).toBeInTheDocument();
    });
});
