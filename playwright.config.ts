import { defineConfig, devices } from '@playwright/test'

const browser = process.env.TEST_BROWSER || 'chromium'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'node server.mjs',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    (() => {
      if (browser === 'chromium') {
        return {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        }
      }
      if (browser === 'firefox') {
        return {
          name: 'firefox',
          use: { ...devices['Desktop Firefox'] },
        }
      }
      if (browser === 'webkit') {
        return {
          name: 'webkit',
          use: { ...devices['Desktop Safari'] },
        }
      }
      throw new Error(`Unsupported browser: ${browser}`)
    })()
  ],
})
