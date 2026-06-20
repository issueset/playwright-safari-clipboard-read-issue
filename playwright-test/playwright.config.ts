import { defineConfig } from '@playwright/test'

export default defineConfig({
  use: { baseURL: 'http://localhost:3100' },
  webServer: {
    command: 'node server.mjs',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: 'webkit', use: { browserName: 'webkit' } }],
})
