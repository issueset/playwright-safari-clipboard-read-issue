import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({
        contextOptions: { permissions: ['clipboard-read'] },
      }),
      instances: [{ browser: 'webkit' }],
    },
  },
})
