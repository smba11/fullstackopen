const { test, expect, beforeEach, describe } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByPlaceholder('title').fill(title)
  await page.getByPlaceholder('author').fill(author)
  await page.getByPlaceholder('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: { name: 'Ada Lovelace', username: 'ada', password: 'secret' },
    })

    await page.goto('http://localhost:5173')
    await loginWith(page, 'ada', 'secret')
  })

  test('a blog can be liked', async ({ page }) => {
    await createBlog(page, 'Likeable blog', 'Ada Lovelace', 'https://example.com/like')
    await page.getByText('Likeable blog Ada Lovelace').getByRole('button', { name: 'view' }).click()
    await page.getByRole('button', { name: 'like' }).click()

    await expect(page.getByText('likes 1')).toBeVisible()
  })
})
