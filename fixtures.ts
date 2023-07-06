import { test as base, expect } from '@playwright/test'

export const test = base.extend({
  page: async ({ baseURL, page }, use) => {
    const messages: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        messages.push(`[${msg.type()}] ${msg.text()}`)
      }
    })
    page.on('pageerror', (error) => {
      messages.push(`[${error.name}] ${error.message}`)
    })
    await use(page)
    expect(messages).toStrictEqual([])
  }
})

export default test
