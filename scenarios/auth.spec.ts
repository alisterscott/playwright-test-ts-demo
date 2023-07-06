import { test } from '../fixtures'
import { expect } from '@playwright/test'

test.describe.parallel('Unauthenticated tests', () => {
  test('can view as guest', async ({ page }) => {
    await page.goto('http://webdriverjsdemo.github.io/auth/')
    await expect(page.locator('text=Hello Please Sign In')).toBeVisible()
  })
})

test.describe.parallel('Admin tests', () => {
  test.use({ storageState: './storage/admin.json' })
  test('can view as admin', async ({ page, context }) => {
    await page.goto('http://webdriverjsdemo.github.io/auth/')
    await expect(page.locator('text=Welcome name=AdminUser')).toBeVisible()
  })
})

test.describe.parallel('User tests', () => {
  test.use({ storageState: './storage/user.json' })
  test('can view as standard user', async ({ page, context }) => {
    await page.goto('http://webdriverjsdemo.github.io/auth/')
    await expect(page.locator('text=Welcome name=StandardPerson')).toBeVisible()
  })
})
