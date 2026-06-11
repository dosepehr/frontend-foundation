import type { Preview } from '@storybook/nextjs-vite'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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
    (Story) => (
      <>
        <GlobalToaster />
        <Story />
      </>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;
