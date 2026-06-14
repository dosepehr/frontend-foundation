export const THEME_ADDON_ID = "theme-addon";
export const THEME_GLOBAL_TYPE_ID = "theme";
export const THEME_EVENT_NAME = "theme-changed";

export const THEME_VALUES = ["light", "dark"] as const;
export type ThemeKey = (typeof THEME_VALUES)[number];

export const DEFAULT_THEME: ThemeKey = "light";

export const THEME_OPTIONS = [
  { value: "light" as const, title: "Light", description: "Light theme" },
  { value: "dark" as const, title: "Dark", description: "Dark theme" },
];

export const isThemeKey = (value: string | undefined | null): value is ThemeKey =>
  !!value && THEME_VALUES.includes(value as ThemeKey);

export const ensureThemeKey = (value: string | undefined | null): ThemeKey =>
  isThemeKey(value) ? value : DEFAULT_THEME;
