import { test, expect } from '@playwright/test'

// Mirrors Playwright's own "should support clipboard read" test:
// https://github.com/microsoft/playwright/blob/main/tests/library/permissions.spec.ts
//
// That test only marks WebKit as broken on Windows and on Linux/WPE headless.
// macOS WebKit is expected to pass, but it throws:
//   NotAllowedError: The request is not allowed by the user agent or the
//   platform in the current context, possibly because the user denied permission.
test('should support clipboard read', async ({ page, context, browserName }) => {
  await page.goto('/')

  // There is no 'clipboard-read' permission in WebKit Web API, but
  // grantPermissions accepts it.
  await context.grantPermissions(['clipboard-read'])

  // There is no 'clipboard-write' permission in WebKit Web API.
  if (browserName === 'chromium') {
    await context.grantPermissions(['clipboard-write'])
  }

  await page.evaluate(() => navigator.clipboard.writeText('test content'))

  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'test content',
  )
})
