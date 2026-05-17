import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'

const BlogList = ({ blogs }) => {
  return (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <div className="blog" key={blog.id}>
          {blog.title} {blog.author}
        </div>
      )}
    </div>
  )
}

const LoginForm = ({ username, password, setUsername, setPassword, handleLogin }) => {
  return (
    <div>
      <h2>Log in to application</h2>
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

const Navigation = ({ user, logout }) => {
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
    </div>
  )
}

const AppContent = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

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

  return (
    <div>
      <Navigation user={user} logout={logout} />
      <Routes>
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

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
