import { useEffect, useState } from 'react'
import axios from 'axios'

const Blog = ({ blog }) => {
  return (
    <div>
      {blog.title} {blog.author}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios
      .get('/api/blogs')
      .then(response => {
        setBlogs(response.data)
      })
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    const response = await axios.post('/api/login', {
      username,
      password,
    })

    setUser(response.data)
    setUsername('')
    setPassword('')
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
