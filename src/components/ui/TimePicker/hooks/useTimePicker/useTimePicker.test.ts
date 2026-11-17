import { renderHook } from '@testing-library/react';
import { useTimePicker, type UseTimePickerOptions } from './useTimePicker';

const setup = (options: UseTimePickerOptions) =>
    renderHook(() => useTimePicker(options)).result.current;

const column = (result: ReturnType<typeof setup>, id: string) => {
    const found = result.columns.find((item) => item.id === id);
    if (!found) throw new Error(`No ${id} column`);
    return found;
};

describe('useTimePicker', () => {
    it('builds hour and minute columns on a 24-hour clock', () => {
        const result = setup({ value: '14:05' });
        expect(result.columns.map((item) => item.id)).toEqual([
            'hours',
            'minutes',
        ]);
        expect(column(result, 'hours').options).toHaveLength(24);
        expect(column(result, 'hours').selected).toBe(14);
        expect(column(result, 'minutes').selected).toBe(5);
        expect(column(result, 'minutes').options[5].label).toBe('05');
        expect(result.hasValue).toBe(true);
    });

    it('has no selection without a value', () => {
        const result = setup({});
        expect(result.hasValue).toBe(false);
        expect(column(result, 'hours').selected).toBeUndefined();
    });

    it('adds seconds and respects steps', () => {
        const result = setup({
            showSeconds: true,
            minuteStep: 15,
            secondStep: 30,
        });
        expect(column(result, 'minutes').options.map((o) => o.value)).toEqual([
            0, 15, 30, 45,
        ]);
        expect(column(result, 'seconds').options.map((o) => o.value)).toEqual([
            0, 30,
        ]);
    });

    it('reports updated values', () => {
        const onChange = vi.fn();
        const result = setup({ value: '10:30', onChange });

        column(result, 'hours').onSelect(8);
        expect(onChange).toHaveBeenLastCalledWith('08:30');

        column(result, 'minutes').onSelect(45);
        expect(onChange).toHaveBeenLastCalledWith('10:45');
    });

    it('starts from midnight when empty', () => {
        const onChange = vi.fn();
        setup({ onChange, showSeconds: true }).columns[2].onSelect(15);
        expect(onChange).toHaveBeenCalledWith('00:00:15');
    });

    it('builds a 12-hour clock with a period column', () => {
        const result = setup({ value: '15:00', hourCycle: 12 });
        expect(result.columns.map((item) => item.id)).toEqual([
            'hours',
            'minutes',
            'period',
        ]);
        expect(column(result, 'hours').options[0]).toEqual({
            value: 1,
            label: '1',
        });
        expect(column(result, 'hours').selected).toBe(3);
        expect(column(result, 'period').selected).toBe('PM');
    });

    it('converts 12-hour picks back to 24 hours', () => {
        const onChange = vi.fn();
        const result = setup({ value: '15:20', hourCycle: 12, onChange });

        column(result, 'hours').onSelect(11);
        expect(onChange).toHaveBeenLastCalledWith('23:20');

        column(result, 'period').onSelect('AM');
        expect(onChange).toHaveBeenLastCalledWith('03:20');
    });

    it("defaults to AM and 12 o'clock when empty", () => {
        const onChange = vi.fn();
        const result = setup({ hourCycle: 12, onChange });

        column(result, 'hours').onSelect(9);
        expect(onChange).toHaveBeenLastCalledWith('09:00');

        column(result, 'period').onSelect('PM');
        expect(onChange).toHaveBeenLastCalledWith('12:00');
    });
});
