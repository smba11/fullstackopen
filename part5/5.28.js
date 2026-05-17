const { test, expect, beforeEach, describe } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.goto('http://localhost:5173/login')
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.getByPlaceholder('title').fill(title)
  await page.getByPlaceholder('author').fill(author)
  await page.getByPlaceholder('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

describe('Blog app with routes', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: { name: 'Ada Lovelace', username: 'ada', password: 'secret' },
    })

    await page.goto('http://localhost:5173')
  })

  test('login succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, 'ada', 'secret')

    await expect(page.getByText('Ada Lovelace logged in')).toBeVisible()
    await expect(page).toHaveURL('http://localhost:5173/')
  })

  test('login fails with wrong credentials', async ({ page }) => {
    await loginWith(page, 'ada', 'wrong')

    await expect(page.getByText('Ada Lovelace logged in')).not.toBeVisible()
  })

  test('a logged-in user can create a blog', async ({ page }) => {
    await loginWith(page, 'ada', 'secret')
    await createBlog(page, 'Routed blog', 'Ada Lovelace', 'https://example.com/routed')

    await expect(page.getByRole('link', { name: 'Routed blog Ada Lovelace' })).toBeVisible()
  })

  test('a logged-in user can like a blog', async ({ page }) => {
    await loginWith(page, 'ada', 'secret')
    await createBlog(page, 'Like routed blog', 'Ada Lovelace', 'https://example.com/like')
    await page.getByRole('link', { name: 'Like routed blog Ada Lovelace' }).click()
    await page.getByRole('button', { name: 'like' }).click()

    await expect(page.getByText('likes 1')).toBeVisible()
  })

  test('a logged-in user can delete a blog', async ({ page }) => {
    await loginWith(page, 'ada', 'secret')
    await createBlog(page, 'Delete routed blog', 'Ada Lovelace', 'https://example.com/delete')
    await page.getByRole('link', { name: 'Delete routed blog Ada Lovelace' }).click()

    page.on('dialog', dialog => dialog.accept())
    await page.getByRole('button', { name: 'remove' }).click()

    await expect(page).toHaveURL('http://localhost:5173/')
    await expect(page.getByRole('link', { name: 'Delete routed blog Ada Lovelace' })).not.toBeVisible()
  })
})
