const { test, expect, beforeEach, describe } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: { name: 'Ada Lovelace', username: 'ada', password: 'secret' },
    })

    await page.goto('http://localhost:5173')
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'ada', 'secret')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('title').fill('A new blog from Playwright')
      await page.getByPlaceholder('author').fill('Ada Lovelace')
      await page.getByPlaceholder('url').fill('https://example.com/playwright')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('A new blog from Playwright Ada Lovelace')).toBeVisible()
    })
  })
})
