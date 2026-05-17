import styled from 'styled-components'

const BlogCard = styled.div`
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
  background: white;
`

const BlogTitle = styled.h2`
  margin-top: 0;
  color: #111827;
`

const BlogMeta = styled.div`
  margin: 0.5rem 0;
  color: #4b5563;
`

const ActionButton = styled.button`
  background: ${props => props.$danger ? '#dc2626' : '#2563eb'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  margin-right: 0.5rem;
`

const BlogView = ({ blog, user, likeBlog, removeBlog }) => {
  if (!blog) {
    return null
  }

  const canRemove = user && blog.user && blog.user.username === user.username

  return (
    <BlogCard>
      <BlogTitle>{blog.title}</BlogTitle>
      <BlogMeta>by {blog.author}</BlogMeta>
      <p>
        <a href={blog.url}>{blog.url}</a>
      </p>
      <p>
        likes {blog.likes}
        {user && <ActionButton onClick={() => likeBlog(blog)}>like</ActionButton>}
      </p>
      <BlogMeta>added by {blog.user && blog.user.name}</BlogMeta>
      {canRemove && (
        <ActionButton $danger onClick={() => removeBlog(blog)}>
          remove
        </ActionButton>
      )}
    </BlogCard>
  )
}

export default BlogView
