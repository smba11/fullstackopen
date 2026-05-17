import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('blog form calls event handler with the right details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  await user.type(screen.getByPlaceholderText('title'), 'Testing React forms')
  await user.type(screen.getByPlaceholderText('author'), 'Ada Lovelace')
  await user.type(screen.getByPlaceholderText('url'), 'https://example.com/forms')
  await user.click(screen.getByText('create'))

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing React forms',
    author: 'Ada Lovelace',
    url: 'https://example.com/forms',
  })
})
