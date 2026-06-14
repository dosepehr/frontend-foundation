export const I18N_GLOBAL_TYPE_ID = 'i18n';

export const LOCALES = [
    { country: 'Auto', direction: 'ltr', label: 'Auto', value: 'Auto' },
    {
        country: 'United Kingdom',
        direction: 'ltr',
        label: 'English (UK)',
        value: 'en-GB',
    },
    { country: 'Iran', direction: 'rtl', label: 'Persian', value: 'fa-IR' },
] as const;

export const DEFAULT_LOCALE = 'Auto';

