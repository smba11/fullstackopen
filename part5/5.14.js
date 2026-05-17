import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('shows url and likes when the view button is clicked', async () => {
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

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText('https://example.com/testing')).toBeDefined()
  expect(screen.getByText('likes 7')).toBeDefined()
})
