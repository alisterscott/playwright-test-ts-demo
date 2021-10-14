import { test, expect } from '@playwright/test'
import { goToPath } from '../lib/actions/nav'

test('can check for errors when there are present', async ({ page }) => {
  let errors = ''

  page.on('pageerror', error => {
    errors = errors + error.message
  })

  await goToPath(page, 'error')
  expect(errors).toBe('Purple Monkey Dishwasher Error')
})
