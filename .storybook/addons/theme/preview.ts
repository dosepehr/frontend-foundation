import { DEFAULT_THEME, THEME_GLOBAL_TYPE_ID, THEME_OPTIONS } from "./constants";
export { THEME_GLOBAL_TYPE_ID };

export const themeGlobalType = {
  [THEME_GLOBAL_TYPE_ID]: {
    name: "Theme",
    description: "Color theme for components",
    defaultValue: DEFAULT_THEME,
    toolbar: {
      icon: "paintbrush" as const,
      items: THEME_OPTIONS.map((o) => ({ value: o.value, title: o.title })),
      showName: true,
      dynamicTitle: true,
    },
  },
};
