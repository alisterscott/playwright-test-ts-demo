import { test } from '../fixtures'
import { expect } from '@playwright/test'
import { clickAndWait, goToPath, visitHomePage } from '../lib/actions/nav'
import config from 'config'

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

  test('can automatically check for errors on every page', async ({ page }) => {
    test.fail()
    await goToPath(page, 'error')
  })

  test('can GET a REST API and check response using approval style', async ({ request }) => {
    const response = await request.get(`${config.get('apiURL')}/posts`)
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toMatchSnapshot('posts.txt')
  })

  test('can GET a REST API and check response using assertion style', async ({ request }) => {
    const response = await request.get(`${config.get('apiURL')}/posts`)
    expect(response.status()).toBe(200)
    const body = JSON.parse(await response.text())
    expect(body.length).toBe(3)
    expect(body[0].id).toBe(1)
    expect(body[0].title).toBe('Post 1')
    expect(body[1].id).toBe(2)
    expect(body[1].title).toBe('Post 2')
    expect(body[2].id).toBe(3)
    expect(body[2].title).toBe('Post 3')
  })

  test('can POST a REST API and check response using approval style', async ({ request }) => {
    const response = await request.post(`${config.get('apiURL')}/posts`, { data: { title: 'Post 4' } })
    await expect(response, `Response: ${await response.text()}`).toBeOK()
    const body = await response.text()
    expect(body).toMatchSnapshot('post4.txt')
  })

  test('can POST a REST API and check response using assertion style (using page)', async ({ page }) => {
    const response = await page.request.post(`${config.get('apiURL')}/posts`, { data: { title: 'Post 4' } })
    expect(response.status()).toBe(201)
    const body = JSON.parse(await response.text())
    expect(body.id).toBe(4)
    expect(body.title).toBe('Post 4')
  })

  test('can work with material UI select list', async ({ page }) => {
    await page.goto('https://mui.com/components/selects/')
    await page.click('#demo-simple-select')
    await page.click('li[data-value="30"]')
  })

  test('can wait for network responses when clicking', async ({ page }) => {
    await goToPath(page, 'dynamic')
    await clickAndWait(page, '#show', `${config.get('apiURL')}/posts`)
    await expect(page.locator('#content')).toHaveText('[ { "id": 1, "title": "Post 1" }, { "id": 2, "title": "Post 2" }, { "id": 3, "title": "Post 3" } ]')
  })
})
