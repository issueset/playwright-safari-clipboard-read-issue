import { test, expect } from '@playwright/test'

test.use({ permissions: ['clipboard-read'] })

test('reads text written to the clipboard', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button').click()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('hello')
})
