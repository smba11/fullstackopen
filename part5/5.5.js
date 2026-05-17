import { useEffect, useState } from 'react'
import axios from 'axios'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return <div>{message}</div>
}

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

const Blog = ({ blog }) => {
  return <div>{blog.title} {blog.author}</div>
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    axios.get('/api/blogs').then(response => setBlogs(response.data))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      setUser(JSON.parse(loggedUserJSON))
    }
  }, [])

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const response = await axios.post('/api/login', { username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(response.data))
      setUser(response.data)
      setUsername('')
      setPassword('')
    } catch (error) {
      showNotification('wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }

      const response = await axios.post('/api/blogs', { title, author, url }, config)

      setBlogs(blogs.concat(response.data))
      setTitle('')
      setAuthor('')
      setUrl('')
      showNotification(`a new blog ${response.data.title} by ${response.data.author} added`)
    } catch (error) {
      showNotification('creating a blog failed')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification} />

        <form onSubmit={handleLogin}>
          <div>
            username
            <input value={username} onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password
            <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="new blog">
        <h2>create new</h2>
        <form onSubmit={addBlog}>
          <div>
            title
            <input value={title} onChange={({ target }) => setTitle(target.value)} />
          </div>
          <div>
            author
            <input value={author} onChange={({ target }) => setAuthor(target.value)} />
          </div>
          <div>
            url
            <input value={url} onChange={({ target }) => setUrl(target.value)} />
          </div>
          <button type="submit">create</button>
        </form>
      </Togglable>

      {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
    </div>
  )
}

export default App
