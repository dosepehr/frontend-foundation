import { formatCountdown } from './formatCountdown';

describe('formatCountdown', () => {
    it('formats seconds as m:ss', () => {
        expect(formatCountdown(59)).toBe('0:59');
        expect(formatCountdown(60)).toBe('1:00');
        expect(formatCountdown(125)).toBe('2:05');
        expect(formatCountdown(0)).toBe('0:00');
    });

    it('rounds partial seconds up and clamps negatives', () => {
        expect(formatCountdown(4.2)).toBe('0:05');
        expect(formatCountdown(-3)).toBe('0:00');
    });

    it('uses Persian digits for fa', () => {
        expect(formatCountdown(59, 'fa')).toBe('۰:۵۹');
        expect(formatCountdown(120, 'fa')).toBe('۲:۰۰');
    });
});
