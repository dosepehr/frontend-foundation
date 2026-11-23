import { getBarRadius } from './barRadius';

describe('getBarRadius', () => {
    it('rounds the top of columns', () => {
        expect(getBarRadius(false, false)).toEqual([4, 4, 0, 0]);
        expect(getBarRadius(false, true)).toEqual([4, 4, 0, 0]);
    });

    it('rounds the far end of bars, mirrored in RTL', () => {
        expect(getBarRadius(true, false)).toEqual([0, 4, 4, 0]);
        expect(getBarRadius(true, true)).toEqual([4, 0, 0, 4]);
    });
});
