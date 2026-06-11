import type { Preview } from '@storybook/nextjs-vite'
import { withThemeByClassName } from '@storybook/addon-themes'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { DirectionProvider } from '@radix-ui/react-direction'
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

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story, context) => {
      const dir = (context.globals.direction as 'ltr' | 'rtl') ?? 'rtl'

      useEffect(() => {
        document.documentElement.setAttribute('dir', dir)
      }, [dir])

      return (
        <DirectionProvider dir={dir}>
          <div dir={dir}>
            <GlobalToaster />
            <Story />
          </div>
        </DirectionProvider>
      )
    },
  ],
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
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
}

export default preview
