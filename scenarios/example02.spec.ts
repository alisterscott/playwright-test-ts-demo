import { test, expect } from '@playwright/test'
import { goToPath } from '../lib/actions/nav'

test('can handle alerts', async ({ page }) => {
  page.on('dialog', async dialog => {
    await dialog.accept()
  })
  await goToPath(page, 'leave')
  await page.click('#homelink')
  await page.waitForSelector('#elementappearsparent', { state: 'visible', timeout: 5000 })
})
