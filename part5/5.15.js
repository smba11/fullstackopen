import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('clicking like button twice calls the event handler twice', async () => {
  const blog = {
    title: 'Component testing is useful',
    author: 'Ada Lovelace',
    url: 'https://example.com/testing',
    likes: 7,
    user: {
      name: 'Ada Lovelace',
      username: 'ada',
    },
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} updateBlog={mockHandler} />)

  const user = userEvent.setup()
  await user.click(screen.getByText('view'))

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
