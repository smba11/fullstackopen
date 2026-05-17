import styled from 'styled-components'

const Button = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
`

const Input = styled.input`
  display: block;
  width: 300px;
  margin: 0.25rem 0 0.75rem;
  padding: 0.45rem;
  border: 1px solid #9ca3af;
  border-radius: 4px;
`

const FormBox = styled.div`
  max-width: 360px;
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
`

const LoginForm = ({ username, password, setUsername, setPassword, handleLogin }) => (
  <FormBox>
    <h2>Log in to application</h2>
    <form onSubmit={handleLogin}>
      <label>
        username
        <Input value={username} onChange={({ target }) => setUsername(target.value)} />
      </label>
      <label>
        password
        <Input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
      </label>
      <Button type="submit">login</Button>
    </form>
  </FormBox>
)

const BlogForm = ({ title, author, url, setTitle, setAuthor, setUrl, createBlog }) => (
  <FormBox>
    <h2>create new</h2>
    <form onSubmit={createBlog}>
      <label>
        title
        <Input placeholder="title" value={title} onChange={({ target }) => setTitle(target.value)} />
      </label>
      <label>
        author
        <Input placeholder="author" value={author} onChange={({ target }) => setAuthor(target.value)} />
      </label>
      <label>
        url
        <Input placeholder="url" value={url} onChange={({ target }) => setUrl(target.value)} />
      </label>
      <Button type="submit">create</Button>
    </form>
  </FormBox>
)

export { Button, Input, FormBox, LoginForm, BlogForm }
