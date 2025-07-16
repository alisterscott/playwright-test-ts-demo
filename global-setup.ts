// global-setup.ts
import { Browser, chromium, FullConfig } from '@playwright/test'
import config from 'config'

async function globalSetup (config: FullConfig) {
  const browser = await chromium.launch()
  await saveStorage(browser, 'Standard', 'Person', 'storage/user.json')
  await saveStorage(browser, 'Admin', 'User', 'storage/admin.json')
  await browser.close()
}

async function saveStorage (browser: Browser, firstName: string, lastName: string, saveStoragePath: string) {
  const page = await browser.newPage()
  await page.goto(`${config.get('baseURL')}/auth/`)
  await page.type('#firstname', firstName)
  await page.type('#surname', lastName)
  await page.click('#ok')
  await page.context().storageState({ path: saveStoragePath })
}

export default globalSetup
