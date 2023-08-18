import { Page } from '@playwright/test'
import config from 'config'
import { logging } from '../logging'

function escDoubleQuoteChars (phrase: string) {
  return phrase.replace('"', '""')
}

async function logPageLoadTimes (page: Page) {
  const navTimings = await page.evaluate(() =>
    performance.getEntriesByType('navigation')
  )
  for (const nt of navTimings) {
    let CSVStr = ''
    for (const key in nt) {
      // CSVStr += `"${escDoubleQuoteChars(key.toString())}",` // use this to add the headers
      CSVStr += `"${escDoubleQuoteChars(nt[key].toString())}",`
    }
    logging.info(CSVStr)
  }
}

export async function visitHomePage (page: Page) {
  await page.goto(`${config.get('baseURL')}`)
  await logPageLoadTimes(page)
}

export async function goToPath (page: Page, path: string) {
  await page.goto(`${config.get('baseURL')}/${path}`)
  await logPageLoadTimes(page)
}

export async function clickAndWait (page: Page, locator: string, expectResponseURL: string) {
  const [response] = await Promise.all([
    page.waitForResponse(expectResponseURL),
    page.click(locator)
  ])
  return response
}
