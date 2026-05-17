import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useMatch, useNavigate } from 'react-router-dom'
import axios from 'axios'

const BlogList = ({ blogs }) => (
  <div>
    <h2>blogs</h2>
    {blogs.map(blog =>
      <div className="blog" key={blog.id}>
        <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
      </div>
    )}
  </div>
)

const BlogView = ({ blog, user, likeBlog, removeBlog }) => {
  if (!blog) {
    return null
  }

  const canRemove = user && blog.user && blog.user.username === user.username

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        likes {blog.likes}
        {user && <button onClick={() => likeBlog(blog)}>like</button>}
      </div>
      <div>added by {blog.user && blog.user.name}</div>
      {canRemove && <button onClick={() => removeBlog(blog)}>remove</button>}
    </div>
  )
}

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title
          <input placeholder="title" value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author
          <input placeholder="author" value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          url
          <input placeholder="url" value={url} onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

const LoginForm = ({ username, password, setUsername, setPassword, handleLogin }) => (
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
)

const AppContent = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find(item => item.id === match.params.id) : null

  useEffect(() => {
    axios.get('/api/blogs').then(response => setBlogs(response.data))

    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      setUser(JSON.parse(loggedUserJSON))
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    const response = await axios.post('/api/login', { username, password })
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(response.data))
    setUser(response.data)
    navigate('/')
  }

  const createBlog = async (blogObject) => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } }
    const response = await axios.post('/api/blogs', blogObject, config)
    setBlogs(blogs.concat(response.data))
    navigate('/')
  }

  const likeBlog = async (blogToLike) => {
    const changedBlog = { ...blogToLike, user: blogToLike.user.id, likes: blogToLike.likes + 1 }
    const response = await axios.put(`/api/blogs/${blogToLike.id}`, changedBlog)
    setBlogs(blogs.map(item => item.id !== blogToLike.id ? item : { ...response.data, user: blogToLike.user }))
  }

  const removeBlog = async (blogToRemove) => {
    if (window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}`)) {
      const config = { headers: { Authorization: `Bearer ${user.token}` } }
      await axios.delete(`/api/blogs/${blogToRemove.id}`, config)
      setBlogs(blogs.filter(item => item.id !== blogToRemove.id))
      navigate('/')
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/')
  }

  const padding = { padding: 5 }

  return (
    <div>
      <Link style={padding} to="/">blogs</Link>
      {user && <Link style={padding} to="/create">new blog</Link>}
      {!user && <Link style={padding} to="/login">login</Link>}
      {user && <>{user.name} logged in <button onClick={logout}>logout</button></>}

      <Routes>
        <Route path="/blogs/:id" element={<BlogView blog={blog} user={user} likeBlog={likeBlog} removeBlog={removeBlog} />} />
        <Route path="/create" element={user ? <BlogForm createBlog={createBlog} /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={user ? <Navigate replace to="/" /> : <LoginForm username={username} password={password} setUsername={setUsername} setPassword={setPassword} handleLogin={handleLogin} />} />
        <Route path="/" element={<BlogList blogs={blogs} />} />
      </Routes>
    </div>
  )
}

const App = () => (
  <Router>
    <AppContent />
  </Router>
)

export default App
