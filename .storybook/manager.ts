import { addons } from 'storybook/manager-api'
import { lightTheme, darkTheme } from './theme'

addons.setConfig({
  theme: lightTheme,
})

// Sync the manager UI theme when storybook-dark-mode toggles
if (typeof window !== 'undefined') {
  const update = () => {
    const isDark = document.body.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    addons.setConfig({ theme: isDark ? darkTheme : lightTheme })
  }

  const observer = new MutationObserver(update)
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
}
