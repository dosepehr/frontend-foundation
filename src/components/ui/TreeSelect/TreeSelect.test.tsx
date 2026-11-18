import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import TreeSelect from '.';
import type { TreeSelectProps } from './TreeSelect.types';
import type { TreeOption } from './utils/tree/tree';

const OPTIONS: TreeOption[] = [
    {
        value: 'fruit',
        label: 'Fruit',
        children: [
            { value: 'apple', label: 'Apple' },
            { value: 'banana', label: 'Banana' },
            {
                value: 'citrus',
                label: 'Citrus',
                children: [
                    { value: 'lemon', label: 'Lemon' },
                    { value: 'lime', label: 'Lime' },
                ],
            },
        ],
    },
    { value: 'bread', label: 'Bread' },
    { value: 'cake', label: 'Cake', disabled: true },
];

function Controlled(props: Partial<TreeSelectProps>) {
    const [selected, setSelected] = useState<string[]>(props.selected ?? []);
    return (
        <>
            <TreeSelect
                options={OPTIONS}
                {...props}
                selected={selected}
                onChange={setSelected}
            />
            <output>{selected.join(',') || 'none'}</output>
        </>
    );
}

const openTree = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(screen.getByRole('button', { expanded: false }));
};
const item = (name: string) =>
    screen.getByRole('treeitem', {
        name: new RegExp(`^(Expand |Collapse )?${name}`),
    });

describe('TreeSelect — trigger', () => {
    it('shows the placeholder while empty', () => {
        render(<TreeSelect options={OPTIONS} selected={[]} />);
        expect(screen.getByRole('button')).toHaveTextContent('Select options');
    });

    it('shows one label or a count', () => {
        const { rerender } = render(
            <TreeSelect options={OPTIONS} selected={['apple']} />,
        );
        expect(
            screen.getByRole('button', { name: 'Apple' }),
        ).toBeInTheDocument();

        rerender(
            <TreeSelect options={OPTIONS} selected={['apple', 'lemon']} />,
        );
        expect(
            screen.getByRole('button', { name: '2 selected' }),
        ).toBeInTheDocument();
    });

    it('shows removable badges for multiple selections', async () => {
        const user = userEvent.setup();
        render(<Controlled selected={['apple', 'bread']} />);

        await user.click(screen.getByRole('button', { name: 'Remove Apple' }));

        expect(screen.getByRole('status')).toHaveTextContent('bread');
    });

    it('can hide the badges', () => {
        render(
            <TreeSelect
                options={OPTIONS}
                selected={['apple']}
                hideSelectedBadges
            />,
        );
        expect(
            screen.queryByRole('button', { name: 'Remove Apple' }),
        ).not.toBeInTheDocument();
    });

    it('renders the label, description and error', () => {
        render(
            <TreeSelect
                options={OPTIONS}
                selected={[]}
                label="Food"
                description="Pick some"
                error="Required"
            />,
        );
        expect(screen.getByLabelText('Food')).toHaveAttribute(
            'aria-invalid',
            'true',
        );
        expect(screen.getByText('Pick some')).toBeInTheDocument();
        expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('can be disabled', () => {
        render(<TreeSelect options={OPTIONS} selected={['apple']} disabled />);
        expect(screen.getByRole('button', { name: 'Apple' })).toBeDisabled();
        expect(
            screen.queryByRole('button', { name: 'Remove Apple' }),
        ).not.toBeInTheDocument();
    });
});

describe('TreeSelect — multiple', () => {
    it('shows the top level collapsed', async () => {
        const user = userEvent.setup();
        render(<Controlled />);
        await openTree(user);

        expect(screen.getByRole('tree')).toHaveAttribute(
            'aria-multiselectable',
            'true',
        );
        expect(item('Fruit')).toHaveAttribute('aria-expanded', 'false');
        expect(
            screen.queryByRole('treeitem', { name: /Apple/ }),
        ).not.toBeInTheDocument();
    });

    it('expands with the chevron without selecting', async () => {
        const user = userEvent.setup();
        render(<Controlled />);
        await openTree(user);

        await user.click(screen.getByRole('button', { name: 'Expand Fruit' }));

        expect(item('Apple')).toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent('none');
    });

    it('selects every leaf when a parent is clicked', async () => {
        const user = userEvent.setup();
        render(<Controlled defaultExpanded="all" />);
        await openTree(user);

        await user.click(screen.getByText('Citrus'));

        expect(screen.getByRole('status')).toHaveTextContent('lemon,lime');
        expect(item('Citrus')).toHaveAttribute('aria-checked', 'true');
        expect(item('Fruit')).toHaveAttribute('aria-checked', 'mixed');
    });

    it('unselects a fully selected parent', async () => {
        const user = userEvent.setup();
        render(
            <Controlled
                defaultExpanded={['fruit']}
                selected={['lemon', 'lime', 'bread']}
            />,
        );
        await openTree(user);

        await user.click(screen.getByText('Citrus'));

        expect(screen.getByRole('status')).toHaveTextContent('bread');
    });

    it('ignores disabled options', async () => {
        const user = userEvent.setup();
        render(<Controlled />);
        await openTree(user);

        expect(item('Cake')).toHaveAttribute('aria-disabled', 'true');
        await user.click(screen.getByText('Cake'));

        expect(screen.getByRole('status')).toHaveTextContent('none');
    });

    it('converts Persian and Arabic digits in the search to English', async () => {
        const user = userEvent.setup();
        render(<Controlled />);
        await openTree(user);

        await user.type(screen.getByRole('searchbox'), '۱٢');

        expect(screen.getByRole('searchbox')).toHaveValue('12');
    });

    it('filters by search, showing ancestors of matches', async () => {
        const user = userEvent.setup();
        render(<Controlled />);
        await openTree(user);

        await user.type(screen.getByRole('searchbox'), 'lem');

        expect(item('Fruit')).toHaveAttribute('aria-expanded', 'true');
        expect(item('Lemon')).toBeInTheDocument();
        expect(screen.queryByText('Lime')).not.toBeInTheDocument();
        expect(screen.queryByText('Bread')).not.toBeInTheDocument();
    });

    it('shows the empty text without matches', async () => {
        const user = userEvent.setup();
        render(<Controlled notFoundText="Nothing here" />);
        await openTree(user);

        await user.type(screen.getByRole('searchbox'), 'zzz');

        expect(screen.getByText('Nothing here')).toBeInTheDocument();
    });

    it('moves with the arrow keys, expands, collapses and selects', async () => {
        const user = userEvent.setup();
        render(<Controlled />);
        await openTree(user);

        await user.click(screen.getByRole('searchbox'));
        await user.keyboard('{ArrowDown}');
        expect(item('Fruit')).toHaveFocus();

        await user.keyboard('{ArrowRight}');
        expect(item('Fruit')).toHaveAttribute('aria-expanded', 'true');

        await user.keyboard('{ArrowDown}');
        expect(item('Apple')).toHaveFocus();
        await user.keyboard(' ');
        expect(screen.getByRole('status')).toHaveTextContent('apple');

        await user.keyboard('{ArrowUp}{ArrowLeft}');
        expect(item('Fruit')).toHaveAttribute('aria-expanded', 'false');

        await user.keyboard('{End}{Enter}');
        expect(screen.getByRole('status')).toHaveTextContent('apple,bread');
    });
});

describe('TreeSelect — single', () => {
    it('picks one leaf and closes', async () => {
        const user = userEvent.setup();
        render(<Controlled multiple={false} defaultExpanded="all" />);
        await openTree(user);

        expect(screen.getByRole('tree')).not.toHaveAttribute(
            'aria-multiselectable',
        );
        await user.click(screen.getByText('Lime'));

        expect(screen.getByRole('status')).toHaveTextContent('lime');
        expect(screen.queryByRole('tree')).not.toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Lime' }),
        ).toBeInTheDocument();
    });

    it('expands parents instead of selecting them', async () => {
        const user = userEvent.setup();
        render(<Controlled multiple={false} />);
        await openTree(user);

        await user.click(screen.getByText('Fruit'));

        expect(item('Fruit')).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('status')).toHaveTextContent('none');
    });

    it('marks the selected leaf', async () => {
        const user = userEvent.setup();
        render(<Controlled multiple={false} selected={['bread']} />);
        await openTree(user);

        expect(item('Bread')).toHaveAttribute('aria-selected', 'true');
        expect(
            screen.queryByRole('button', { name: 'Remove Bread' }),
        ).not.toBeInTheDocument();
    });
});

describe('TreeSelect — loading and errors', () => {
    it('shows a disabled loading trigger with a spinner', () => {
        render(<TreeSelect options={[]} selected={[]} isPending />);
        const trigger = screen.getByRole('button', { name: /Loading/ });
        expect(trigger).toBeDisabled();
        expect(trigger).toHaveAttribute('aria-busy', 'true');
        expect(trigger.querySelector('svg.animate-spin')).toBeInTheDocument();
    });

    it('shows a disabled error trigger', () => {
        render(<TreeSelect options={[]} selected={[]} isError />);
        expect(
            screen.getByRole('button', { name: 'Failed to load' }),
        ).toBeDisabled();
    });

    it('uses custom loading and error text', () => {
        const { rerender } = render(
            <TreeSelect
                options={[]}
                selected={[]}
                isPending
                loadingText="در حال بارگذاری"
            />,
        );
        expect(screen.getByRole('button')).toHaveTextContent('در حال بارگذاری');

        rerender(
            <TreeSelect
                options={[]}
                selected={[]}
                isError
                errorText="خطا در بارگذاری"
            />,
        );
        expect(screen.getByRole('button')).toHaveTextContent('خطا در بارگذاری');
    });

    it('shows the loading state instead of the selection and hides remove buttons', () => {
        render(<TreeSelect options={OPTIONS} selected={['apple']} isPending />);
        expect(
            screen.getByRole('button', { name: /Loading/ }),
        ).not.toHaveTextContent('Apple');
        expect(
            screen.queryByRole('button', { name: 'Remove Apple' }),
        ).not.toBeInTheDocument();
    });

    it('opens normally once loaded', async () => {
        const user = userEvent.setup();
        const { rerender } = render(
            <TreeSelect options={[]} selected={[]} isPending />,
        );

        rerender(<TreeSelect options={OPTIONS} selected={[]} />);
        await user.click(
            screen.getByRole('button', { name: 'Select options' }),
        );

        expect(screen.getByRole('tree')).toBeInTheDocument();
    });
});
