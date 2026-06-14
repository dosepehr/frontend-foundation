import { create } from "storybook/theming/create";

const base = {
  brandTitle: "Frontend Foundation",
  brandTarget: "_self",
  fontBase: '"Lato", "Estedad", ui-sans-serif, system-ui, sans-serif',
  fontCode: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
};

const lightTheme = create({
  ...base,
  base: "light",

  colorPrimary: "#2563eb",
  colorSecondary: "#2563eb",

  appBg: "#f9f9fb",
  appContentBg: "#ffffff",
  appPreviewBg: "#ffffff",
  appBorderColor: "#e8e8e8",
  appBorderRadius: 10,

  barBg: "#ffffff",
  barTextColor: "#555555",
  barHoverColor: "#2563eb",
  barSelectedColor: "#2563eb",

  textColor: "#111111",
  textMutedColor: "#777777",
  textInverseColor: "#ffffff",

  inputBg: "#ffffff",
  inputBorder: "#e8e8e8",
  inputTextColor: "#111111",
  inputBorderRadius: 8,
});

const darkTheme = create({
  ...base,
  base: "dark",

  colorPrimary: "#4d8ef5",
  colorSecondary: "#4d8ef5",

  appBg: "#1a1a1a",
  appContentBg: "#111111",
  appPreviewBg: "#111111",
  appBorderColor: "#2a2a2a",
  appBorderRadius: 10,

  barBg: "#1a1a1a",
  barTextColor: "#aaaaaa",
  barHoverColor: "#4d8ef5",
  barSelectedColor: "#4d8ef5",

  textColor: "#f5f5f5",
  textMutedColor: "#888888",
  textInverseColor: "#111111",

  inputBg: "#1f1f1f",
  inputBorder: "#2a2a2a",
  inputTextColor: "#f5f5f5",
  inputBorderRadius: 8,
});

export const themes = { light: lightTheme, dark: darkTheme };
export { lightTheme, darkTheme };
