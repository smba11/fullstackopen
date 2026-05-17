import { useEffect, useState } from 'react'
import axios from 'axios'

const Blog = ({ blog, user, updateBlog, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const addLike = () => {
    updateBlog(blog.id, {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    })
  }

  const canRemove = blog.user && user && blog.user.username === user.username

  return (
    <div style={{ paddingTop: 10, paddingLeft: 2, border: 'solid', borderWidth: 1, marginBottom: 5 }}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={addLike}>like</button>
          </div>
          <div>{blog.user && blog.user.name}</div>
          {canRemove && <button onClick={() => removeBlog(blog)}>remove</button>}
        </div>
      )}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios.get('/api/blogs').then(response => setBlogs(response.data))

    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      setUser(JSON.parse(loggedUserJSON))
    }
  }, [])

  const updateBlog = async (id, blogObject) => {
    const response = await axios.put(`/api/blogs/${id}`, blogObject)
    const oldBlog = blogs.find(blog => blog.id === id)
    const returnedBlog = { ...response.data, user: oldBlog.user }

    setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
  }

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }

      await axios.delete(`/api/blogs/${blog.id}`, config)
      setBlogs(blogs.filter(item => item.id !== blog.id))
    }
  }

  const blogsByLikes = [...blogs].sort((first, second) => second.likes - first.likes)

  return (
    <div>
      <h2>blogs</h2>
      {blogsByLikes.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
        />
      )}
    </div>
  )
}

export default App
