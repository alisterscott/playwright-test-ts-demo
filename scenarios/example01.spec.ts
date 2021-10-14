import { test, expect } from '@playwright/test'
import { visitHomePage } from '../lib/actions/nav'

test('can wait for an element to appear', async ({ page }) => {
  await visitHomePage(page)
  await page.waitForSelector('#elementappearschild', { state: 'visible', timeout: 5000 })
  expect(await page.screenshot()).toMatchSnapshot('element-appears.png', { threshold: 0.5 })
})

test('can use an element that appears after on page load', async ({ page }) => {
  await visitHomePage(page)
  const text = await page.textContent('#loadedchild')
  expect(text).toBe('Loaded!')
  expect(await page.screenshot()).toMatchSnapshot('element-after-onload.png', { threshold: 0.5 })
})
