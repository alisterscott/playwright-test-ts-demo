import { test } from '../fixtures'
import { expect } from '@playwright/test'
import { goToPath } from '../lib/actions/nav'

test.describe('Unauthenticated tests', () => {
  test('can view as guest', async ({ page }) => {
    await goToPath(page, 'auth')
    await expect(page.locator('text=Hello Please Sign In')).toBeVisible()
  })
})

test.describe('Admin tests', () => {
  test.use({ storageState: './storage/admin.json' })
  test('can view as admin', async ({ page, context }) => {
    await goToPath(page, 'auth')
    await expect(page.locator('text=Welcome Admin User')).toBeVisible()
  })
})

test.describe('User tests', () => {
  test.use({ storageState: './storage/user.json' })
  test('can view as standard user', async ({ page, context }) => {
    await goToPath(page, 'auth')
    await expect(page.locator('text=Welcome Standard Person')).toBeVisible()
  })
})
