import { test, expect } from '@playwright/test'
import { visitHomePage } from '../lib/actions/nav'

test('can check for errors when there should be none', async ({ page }) => {
  let errors = ''
  page.on('pageerror', pageerr => {
    errors = errors + pageerr
  })
  await visitHomePage(page)
  expect(errors).toBe('')
})
