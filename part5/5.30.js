import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
`

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #111827;
  color: white;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
`

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`

const NotificationBox = styled.div`
  padding: 0.75rem 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  color: ${props => props.$error ? '#991b1b' : '#166534'};
  background: ${props => props.$error ? '#fee2e2' : '#dcfce7'};
  border: 1px solid ${props => props.$error ? '#fca5a5' : '#86efac'};
`

const Notification = ({ message, error }) => {
  if (!message) {
    return null
  }

  return <NotificationBox $error={error}>{message}</NotificationBox>
}

const BlogNavigation = ({ user, logout }) => (
  <Navigation>
    <NavLink to="/">blogs</NavLink>
    {user && <NavLink to="/create">new blog</NavLink>}
    {!user && <NavLink to="/login">login</NavLink>}
    {user && (
      <span>
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </span>
    )}
  </Navigation>
)

export { Page, BlogNavigation, Notification }
