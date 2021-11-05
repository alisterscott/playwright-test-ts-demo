import { test, expect } from '@playwright/test'

test.describe.parallel('Unauthenticated tests', () => {
  test('can view as guest', async ({ page }) => {
    await page.goto('http://webdriverjsdemo.github.io/auth/')
    await expect(page.locator('text=Hello Please Sign In')).toBeVisible()
  })
})

test.describe.parallel('Unauthenticated tests', () => {
  test('can view as admin', async ({ page }) => {
    await page.goto('http://webdriverjsdemo.github.io/auth/')
    await page.type('#firstname', 'Admin')
    await page.type('#surname', 'User')
    await page.click('#ok')
    await page.goto('http://webdriverjsdemo.github.io/auth/')
    await expect(page.locator('text=Welcome name=AdminUser')).toBeVisible()
  })

  test('can view as standard user', async ({ page }) => {
    await page.goto('http://webdriverjsdemo.github.io/auth/')
    await page.type('#firstname', 'Standard')
    await page.type('#surname', 'Person')
    await page.click('#ok')
    await page.goto('http://webdriverjsdemo.github.io/auth/')
    await expect(page.locator('text=Welcome name=StandardPerson')).toBeVisible()
  })
})
