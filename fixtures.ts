import { test as base, expect, Page, Browser, BrowserContext } from '@playwright/test'
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
): Promise<{ context: BrowserContext, page: Page }> {
  const storageExists = fs.existsSync(saveStoragePath)

  if (storageExists === true) {
    const stats = fs.statSync(saveStoragePath)
    const ageMs = Date.now() - stats.mtimeMs
    const hours = ageMs / (1000 * 60 * 60)
    if (hours <= 48) {
      // Use existing storage
      const context = await browser.newContext({ storageState: saveStoragePath })
      const page = await context.newPage()
      return { context, page }
    }
  }

  // Capture new storage
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(`${config.get('baseURL')}/auth/`)
  await page.fill('#firstname', firstName)
  await page.fill('#surname', lastName)
  await page.click('#ok')
  await context.storageState({ path: saveStoragePath })
  return { context, page }
}

export const test = base.extend<{}, {
  pageAdmin: Page
  pageUser: Page
}>({
  pageAdmin: [async ({ browser }, use, workerInfo) => {
    const { context, page } = await useOrSaveStorage(browser, 'Admin', 'User', `storage/admin${workerInfo.workerIndex}.json`)
    await use(page)
    await context.close()
  }, { scope: 'worker' }],
  pageUser: [async ({ browser }, use, workerInfo) => {
    const { context, page } = await useOrSaveStorage(browser, 'Standard', 'Person', `storage/user${workerInfo.workerIndex}.json`)
    await use(page)
    await context.close()
  }, { scope: 'worker' }],
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
})

export default test
export { expect } from '@playwright/test'
