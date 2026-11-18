import {
    formatMobile,
    isValidMobile,
    normalizeMobile,
    sanitizeMobileText,
} from './mobile';

describe('normalizeMobile', () => {
    it.each([
        ['09121234567', '09121234567'],
        ['9121234567', '09121234567'],
        ['+989121234567', '09121234567'],
        ['+98 912 123 4567', '09121234567'],
        ['+98 (0) 912 123 4567', '09121234567'],
        ['00989121234567', '09121234567'],
        ['989121234567', '09121234567'],
        ['0912-123-4567', '09121234567'],
        ['۰۹۱۲۱۲۳۴۵۶۷', '09121234567'],
        ['٠٩١٢١٢٣٤٥٦٧', '09121234567'],
        ['+۹۸۹۱۲۱۲۳۴۵۶۷', '09121234567'],
    ])('normalizes %s', (input, expected) => {
        expect(normalizeMobile(input)).toBe(expected);
    });

    it('keeps 0998 numbers typed without the leading 0', () => {
        expect(normalizeMobile('9981234567')).toBe('09981234567');
    });

    it('returns an empty string when there are no national digits', () => {
        expect(normalizeMobile('')).toBe('');
        expect(normalizeMobile('+')).toBe('');
        expect(normalizeMobile('+98')).toBe('');
        expect(normalizeMobile('0098')).toBe('');
        expect(normalizeMobile('0')).toBe('');
    });

    it('keeps a partial number partial', () => {
        expect(normalizeMobile('0912')).toBe('0912');
        expect(normalizeMobile('+989')).toBe('09');
    });

    it('drops digits past a full number', () => {
        expect(normalizeMobile('091212345678')).toBe('09121234567');
    });
});

describe('sanitizeMobileText', () => {
    it('converts digits and keeps separators and a leading +', () => {
        expect(sanitizeMobileText('+۹۸ (912) 123-4567')).toBe(
            '+98 (912) 123-4567',
        );
    });

    it('drops letters and inner plus signs', () => {
        expect(sanitizeMobileText('+98a+912')).toBe('+98912');
    });
});

describe('formatMobile', () => {
    it('groups a full number 4-3-4', () => {
        expect(formatMobile('09121234567')).toBe('0912 123 4567');
    });

    it('groups a partial number', () => {
        expect(formatMobile('09121')).toBe('0912 1');
        expect(formatMobile('09')).toBe('09');
    });

    it('uses a custom separator, or none', () => {
        expect(formatMobile('09121234567', '-')).toBe('0912-123-4567');
        expect(formatMobile('09121234567', '')).toBe('09121234567');
    });
});

describe('isValidMobile', () => {
    it('accepts a complete number only', () => {
        expect(isValidMobile('09121234567')).toBe(true);
        expect(isValidMobile('0912123456')).toBe(false);
        expect(isValidMobile('08121234567')).toBe(false);
        expect(isValidMobile('')).toBe(false);
    });
});
