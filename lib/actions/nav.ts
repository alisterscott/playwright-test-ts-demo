import { Page } from '@playwright/test'
import config from 'config'

export async function visitHomePage (page: Page) {
  return await page.goto(`${config.get('baseURL')}`)
}

export async function goToPath (page: Page, path: string) {
  return await page.goto(`${config.get('baseURL')}/${path}`)
}
