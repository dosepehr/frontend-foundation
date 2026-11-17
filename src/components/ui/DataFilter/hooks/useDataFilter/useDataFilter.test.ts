import { act, renderHook } from '@testing-library/react';
import { useDataFilter, type UseDataFilterOptions } from './useDataFilter';

const setup = (options: UseDataFilterOptions) =>
    renderHook((props: UseDataFilterOptions) => useDataFilter(props), {
        initialProps: options,
    });

describe('useDataFilter', () => {
    it('starts from the applied search', () => {
        const { result } = setup({ search: 'ada' });
        expect(result.current.searchText).toBe('ada');
    });

    it('starts empty without a search', () => {
        expect(setup({}).result.current.searchText).toBe('');
    });

    it('keeps typed text locally', () => {
        const { result } = setup({ search: '' });
        act(() => result.current.setSearchText('gr'));
        expect(result.current.searchText).toBe('gr');
    });

    it('follows search changes from outside', () => {
        const { result, rerender } = setup({ search: 'a' });
        act(() => result.current.setSearchText('typed'));

        rerender({ search: 'from url' });

        expect(result.current.searchText).toBe('from url');
    });

    it('applies the search only when it changed', () => {
        const onSearchChange = vi.fn();
        const { result } = setup({ search: 'same', onSearchChange });

        result.current.commitSearch('same');
        expect(onSearchChange).not.toHaveBeenCalled();

        result.current.commitSearch('new');
        expect(onSearchChange).toHaveBeenCalledWith('new');
    });
});
