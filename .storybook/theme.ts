import { create } from 'storybook/theming/create'

const base = {
  brandTitle: 'Frontend Foundation',
  brandTarget: '_self',

  // Typography — matches the project's Lato font
  fontBase: '"Lato", sans-serif',
  fontCode: 'monospace',
}

export const lightTheme = create({
  ...base,
  base: 'light',

  // Brand
  colorPrimary: '#2563eb',  // --primary light
  colorSecondary: '#2563eb',

  // UI chrome
  appBg: '#f9f9fb',          // close to --muted light
  appContentBg: '#ffffff',   // --background light
  appPreviewBg: '#ffffff',
  appBorderColor: '#e8e8e8', // --border light
  appBorderRadius: 10,       // --radius 0.625rem ≈ 10px

  // Toolbar
  barTextColor: '#555555',
  barHoverColor: '#2563eb',
  barSelectedColor: '#2563eb',
  barBg: '#ffffff',

  // Text
  textColor: '#111111',        // --foreground light
  textMutedColor: '#777777',  // --muted-foreground light
  textInverseColor: '#ffffff',

  // Inputs
  inputBg: '#ffffff',
  inputBorder: '#e8e8e8',
  inputTextColor: '#111111',
  inputBorderRadius: 8,
})

export const darkTheme = create({
  ...base,
  base: 'dark',

  // Brand
  colorPrimary: '#4d8ef5',   // --primary dark
  colorSecondary: '#4d8ef5',

  // UI chrome
  appBg: '#1a1a1a',          // close to --card dark
  appContentBg: '#111111',   // --background dark
  appPreviewBg: '#111111',
  appBorderColor: '#2a2a2a', // --border dark
  appBorderRadius: 10,

  // Toolbar
  barTextColor: '#aaaaaa',
  barHoverColor: '#4d8ef5',
  barSelectedColor: '#4d8ef5',
  barBg: '#1a1a1a',

  // Text
  textColor: '#f5f5f5',       // --foreground dark
  textMutedColor: '#888888',  // --muted-foreground dark
  textInverseColor: '#111111',

  // Inputs
  inputBg: '#1f1f1f',
  inputBorder: '#2a2a2a',
  inputTextColor: '#f5f5f5',
  inputBorderRadius: 8,
})
