import { addons } from 'storybook/manager-api'
import { lightTheme, darkTheme } from './theme'

addons.setConfig({ theme: lightTheme })

addons.getChannel().on('globalsUpdated', ({ globals }: { globals?: Record<string, string> }) => {
  const theme = globals?.theme === 'dark' ? darkTheme : lightTheme
  addons.setConfig({ theme })
})
