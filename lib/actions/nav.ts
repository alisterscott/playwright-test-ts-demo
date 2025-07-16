import { Page } from '@playwright/test'
import config from 'config'

export async function visitHomePage (page: Page) {
  await page.goto(`${config.get('baseURL')}`)
}

export async function goToPath (page: Page, path: string) {
  await page.goto(`${config.get('baseURL')}/${path}`)
}

export async function clickAndWait (page: Page, locator: string, expectResponseURL: string) {
  const [response] = await Promise.all([
    page.waitForResponse(expectResponseURL),
    page.click(locator)
  ])
  return response
}
