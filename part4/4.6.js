const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogCounts = {}

  blogs.forEach((blog) => {
    blogCounts[blog.author] = (blogCounts[blog.author] || 0) + 1
  })

  const topAuthor = Object.keys(blogCounts).reduce((top, author) => {
    return blogCounts[author] > blogCounts[top] ? author : top
  })

  return {
    author: topAuthor,
    blogs: blogCounts[topAuthor],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
