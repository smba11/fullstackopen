import { render, screen } from '@testing-library/react'
import BlogView from './BlogView'

const blog = {
  id: '1',
  title: 'Routing with React Router',
  author: 'Ada Lovelace',
  url: 'https://example.com/router',
  likes: 4,
  user: {
    username: 'ada',
    name: 'Ada Lovelace',
  },
}

test('blog information is displayed for unauthenticated users without buttons', () => {
  render(<BlogView blog={blog} user={null} likeBlog={() => {}} removeBlog={() => {}} />)

  expect(screen.getByText('Routing with React Router Ada Lovelace')).toBeDefined()
  expect(screen.getByText('https://example.com/router')).toBeDefined()
  expect(screen.getByText('likes 4')).toBeDefined()
  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})

test('authenticated users who are not creators see only the like button', () => {
  const user = {
    username: 'grace',
    name: 'Grace Hopper',
  }

  render(<BlogView blog={blog} user={user} likeBlog={() => {}} removeBlog={() => {}} />)

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.queryByText('remove')).toBeNull()
})

test('the blog creator sees both like and remove buttons', () => {
  const user = {
    username: 'ada',
    name: 'Ada Lovelace',
  }

  render(<BlogView blog={blog} user={user} likeBlog={() => {}} removeBlog={() => {}} />)

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.getByText('remove')).toBeDefined()
})
