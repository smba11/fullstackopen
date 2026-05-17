import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author, but not url or likes by default', () => {
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

  const { container } = render(<Blog blog={blog} />)

  const summary = container.querySelector('.blog-summary')
  const details = container.querySelector('.blog-details')

  expect(summary).toHaveTextContent('Component testing is useful')
  expect(summary).toHaveTextContent('Ada Lovelace')
  expect(details).toHaveStyle('display: none')
  expect(screen.queryByText('https://example.com/testing')).toBeNull()
  expect(screen.queryByText('likes 7')).toBeNull()
})
