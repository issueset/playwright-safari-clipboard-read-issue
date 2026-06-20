import { page } from 'vitest/browser'
import { expect, test } from 'vitest'

test('reads text written to the clipboard', async () => {
  const button = document.createElement('button')
  button.textContent = 'copy'
  button.onclick = () => navigator.clipboard.writeText('hello')
  document.body.append(button)

  await page.getByRole('button').click()

  expect(await navigator.clipboard.readText()).toBe('hello')
})
