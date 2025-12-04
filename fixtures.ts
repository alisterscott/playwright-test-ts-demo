import { test as base, expect, Page, Browser } from '@playwright/test'
import config = require('config')
import * as fs from 'fs'

/**
 * Save the storage state of a user session.
 * @param browser The Playwright browser instance.
 * @param firstName The first name of the user.
 * @param lastName The last name of the user.
 * @param saveStoragePath The file path to save the storage state.
 * @returns The Playwright page instance.
 */
async function useOrSaveStorage (
  browser: Browser,
  firstName: string,
  lastName: string,
  saveStoragePath: string
): Promise<Page> {
  const storageExists = fs.existsSync(saveStoragePath)

  if (storageExists === true) {
    const stats = fs.statSync(saveStoragePath)
    const ageMs = Date.now() - stats.mtimeMs
    const hours = ageMs / (1000 * 60 * 60)
    if (hours <= 48) {
      // Use existing storage
      const context = await browser.newContext({ storageState: saveStoragePath })
      const page = await context.newPage()
      return page
    }
  }

  // Capture new storage
  const page = await browser.newPage()
  await page.goto(`${config.get('baseURL')}/auth/`)
  await page.fill('#firstname', firstName)
  await page.fill('#surname', lastName)
  await page.click('#ok')
  await page.context().storageState({ path: saveStoragePath })
  return page
}

export const test = base.extend< {
  pageAdmin: Page
  pageUser: Page
} >({
  page: async ({ page }, use) => {
    const messages: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        messages.push(`[${msg.type()}] ${msg.text()}`)
      }
    })
    page.on('pageerror', (error) => {
      messages.push(`[${error.name}] ${error.message}`)
    })
    page.once('load', async () => {
      const url = page.url();
      // run javascript to put url in top of page
      await page.evaluate((url) => {
        document.body.insertAdjacentHTML('afterbegin', `<div style="position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:9999;padding:10px 16px;background:white;border:1px solid #ccc;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-family:sans-serif;font-size:14px;text-align:center;">${url}</div>`);
      }, url)
    })
    await use(page)
    expect(messages).toStrictEqual([])
  },
  pageAdmin: async ({ browser }, use) => {
    const page = await useOrSaveStorage(browser, 'Admin', 'User', 'storage/admin.json')
    await use(page)
    await page.close()
  },
  pageUser: async ({ browser }, use) => {
    const page = await useOrSaveStorage(browser, 'Standard', 'Person', 'storage/user.json')
    await use(page)
    await page.close()
  }
})

export default test
export { expect } from '@playwright/test'
