import { test, expect } from '@playwright/test'
import { goToPath, visitHomePage } from '../lib/actions/nav'

test.describe.parallel('All tests', () => {
  test('can wait for an element to appear', async ({ page }) => {
    await visitHomePage(page)
    await page.waitForSelector('#elementappearschild', { state: 'visible', timeout: 5000 })
  })

  test('can use an element that appears after on page load', async ({ page }) => {
    await visitHomePage(page)
    const text = await page.textContent('#loadedchild')
    expect(text).toBe('Loaded!')
  })

  test('can handle alerts without any additional code', async ({ page }) => {
    await goToPath(page, 'leave')
    await page.click('#homelink')
    await page.waitForSelector('#elementappearsparent', { state: 'visible', timeout: 5000 })
  })

  test('can check for errors when there should be none', async ({ page }) => {
    let errors = ''
    page.on('pageerror', pageerr => {
      errors = errors + pageerr.message
    })
    await visitHomePage(page)
    expect(errors).toBe('')
  })

  test('can check for errors when there are present', async ({ page }) => {
    let errors = ''

    page.on('pageerror', error => {
      errors = errors + error.message
    })

    await goToPath(page, 'error')
    expect(errors).toBe('Purple Monkey Dishwasher Error')
  })
})
