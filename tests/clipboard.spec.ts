import { test, expect, type Frame, type Page } from '@playwright/test'

// This repro isolates *why* `navigator.clipboard.readText()` throws
//   NotAllowedError: The request is not allowed by the user agent ...
// in WebKit, by crossing two variables:
//
//   * permission:  granted via context.grantPermissions(['clipboard-read'])  vs  not granted
//   * realm:       top-level document  vs  a same-origin <iframe>
//
// meowdown's vitest-browser setup hits the "not granted, iframe" corner for
// WebKit (it only grants clipboard permissions to Chromium, and vitest runs
// each test inside an iframe), which is the combination that fails on macOS.
//
// In every case the write happens from a real user gesture (a button click),
// exactly like meowdown's code-block copy button.

const TEXT = 'test content'

async function grant(page: Page, browserName: string): Promise<void> {
  await page.context().grantPermissions(['clipboard-read'])
  // There is no 'clipboard-write' permission in the WebKit/Firefox Web API.
  if (browserName === 'chromium') {
    await page.context().grantPermissions(['clipboard-write'])
  }
}

function getIframe(page: Page): Frame {
  const frame = page.frames().find((candidate) => candidate.url().endsWith('/frame'))
  if (!frame) {
    throw new Error('could not find the /frame iframe')
  }
  return frame
}

function readClipboard(frame: Frame): Promise<string> {
  return frame.evaluate(() => navigator.clipboard.readText())
}

test.describe('top-level document', () => {
  test('permission granted', async ({ page, browserName }) => {
    await page.goto('/')
    await grant(page, browserName)
    await page.locator('#copy').click()
    await expect(page.locator('body')).toHaveAttribute('data-copied')
    expect(await readClipboard(page.mainFrame())).toBe(TEXT)
  })

  test('permission not granted', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'meowdown only studies the WebKit, no-grant corner')
    await page.goto('/')
    await page.locator('#copy').click()
    await expect(page.locator('body')).toHaveAttribute('data-copied')
    expect(await readClipboard(page.mainFrame())).toBe(TEXT)
  })
})

test.describe('same-origin iframe', () => {
  test('permission granted', async ({ page, browserName }) => {
    await page.goto('/')
    await grant(page, browserName)
    await page.frameLocator('#frame').locator('#copy').click()
    expect(await readClipboard(getIframe(page))).toBe(TEXT)
  })

  test('permission not granted', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'meowdown only studies the WebKit, no-grant corner')
    await page.goto('/')
    await page.frameLocator('#frame').locator('#copy').click()
    expect(await readClipboard(getIframe(page))).toBe(TEXT)
  })
})
