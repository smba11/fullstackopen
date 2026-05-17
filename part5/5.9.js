import { useEffect, useState } from 'react'
import axios from 'axios'

const Blog = ({ blog, updateBlog }) => {
  const [visible, setVisible] = useState(false)

  const addLike = () => {
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }

    updateBlog(blog.id, updatedBlog)
  }

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
        </div>
      )}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    axios.get('/api/blogs').then(response => setBlogs(response.data))
  }, [])

  const updateBlog = async (id, blogObject) => {
    const response = await axios.put(`/api/blogs/${id}`, blogObject)
    const oldBlog = blogs.find(blog => blog.id === id)
    const returnedBlog = {
      ...response.data,
      user: oldBlog.user,
    }

    setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
  }

  return (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} />
      )}
    </div>
  )
}

export default App
