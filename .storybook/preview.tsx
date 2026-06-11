import type { Preview } from '@storybook/nextjs-vite'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { DirectionProvider } from '@radix-ui/react-direction'
import { ThemeProvider, useTheme } from 'next-themes'
import './fonts.css'
import '../src/app/globals.css'
import { Toaster } from '../src/components/ui/Toast'

let toasterMounted = false

function GlobalToaster() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (toasterMounted) return
    toasterMounted = true
    const el = document.createElement('div')
    el.id = 'storybook-toaster-root'
    document.body.appendChild(el)
    ref.current = el
    return () => {
      toasterMounted = false
      el.remove()
    }
  }, [])

  if (typeof document === 'undefined') return null
  const container = document.getElementById('storybook-toaster-root')
  if (!container) return null
  return createPortal(<Toaster position='bottom-right' />, container)
}

function ThemeSync({ theme }: { theme: string }) {
  const { setTheme } = useTheme()
  useEffect(() => {
    setTheme(theme)
  }, [theme, setTheme])
  return null
}

const preview: Preview = {
  globalTypes: {
    direction: {
      name: 'Direction',
      description: 'Text direction',
      defaultValue: 'rtl',
      toolbar: {
        icon: 'paragraph',
        items: [
          { value: 'ltr', title: 'LTR', right: '→' },
          { value: 'rtl', title: 'RTL', right: '←' },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      name: 'Theme',
      description: 'Color theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'sun',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'system', title: 'System', icon: 'browser' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const dir = (context.globals.direction as 'ltr' | 'rtl') ?? 'rtl'
      const theme = (context.globals.theme as string) ?? 'light'

      useEffect(() => {
        document.documentElement.setAttribute('dir', dir)
      }, [dir])

      return (
        <ThemeProvider attribute="class" enableSystem>
          <ThemeSync theme={theme} />
          <DirectionProvider dir={dir}>
            <div dir={dir}>
              <GlobalToaster />
              <Story />
            </div>
          </DirectionProvider>
        </ThemeProvider>
      )
    },
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    }
  },
};

export default preview;
