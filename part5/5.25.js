import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useMatch, useNavigate } from 'react-router-dom'
import axios from 'axios'

const BlogList = ({ blogs }) => {
  return (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <div className="blog" key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
        </div>
      )}
    </div>
  )
}

const BlogView = ({ blog, user, likeBlog }) => {
  if (!blog) {
    return null
  }

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        likes {blog.likes}
        {user && <button onClick={() => likeBlog(blog)}>like</button>}
      </div>
      <div>added by {blog.user && blog.user.name}</div>
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
    setUsername('')
    setPassword('')
    navigate('/')
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/')
  }

  const likeBlog = async (blogToLike) => {
    const changedBlog = {
      ...blogToLike,
      user: blogToLike.user.id,
      likes: blogToLike.likes + 1,
    }

    const response = await axios.put(`/api/blogs/${blogToLike.id}`, changedBlog)
    setBlogs(blogs.map(item =>
      item.id !== blogToLike.id ? item : { ...response.data, user: blogToLike.user }
    ))
  }

  const padding = { padding: 5 }

  return (
    <div>
      <Link style={padding} to="/">blogs</Link>
      {!user && <Link style={padding} to="/login">login</Link>}
      {user && (
        <>
          {user.name} logged in
          <button onClick={logout}>logout</button>
        </>
      )}

      <Routes>
        <Route path="/blogs/:id" element={<BlogView blog={blog} user={user} likeBlog={likeBlog} />} />
        <Route path="/login" element={
          user
            ? <Navigate replace to="/" />
            : (
              <LoginForm
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
                handleLogin={handleLogin}
              />
            )
        } />
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
