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

  test('blogs are ordered by likes with the most liked first', async ({ page }) => {
    await createBlog(page, 'Few likes', 'Ada Lovelace', 'https://example.com/few')
    await createBlog(page, 'Most likes', 'Ada Lovelace', 'https://example.com/most')
    await createBlog(page, 'Middle likes', 'Ada Lovelace', 'https://example.com/middle')

    const mostLiked = page.getByText('Most likes Ada Lovelace')
    const middleLiked = page.getByText('Middle likes Ada Lovelace')

    await mostLiked.getByRole('button', { name: 'view' }).click()
    await page.getByRole('button', { name: 'like' }).click()
    await page.getByRole('button', { name: 'like' }).click()

    await middleLiked.getByRole('button', { name: 'view' }).click()
    await page.getByRole('button', { name: 'like' }).last().click()

    const blogs = page.locator('.blog')
    await expect(blogs.nth(0)).toContainText('Most likes')
    await expect(blogs.nth(1)).toContainText('Middle likes')
    await expect(blogs.nth(2)).toContainText('Few likes')
  })
})
