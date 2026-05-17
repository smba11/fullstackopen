const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const express = require('express')

const app = express()

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
})

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

const User = mongoose.model('User', userSchema)
const Blog = mongoose.model('Blog', blogSchema)

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }

  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  request.user = await User.findById(decodedToken.id)

  next()
}

mongoose.connect('mongodb://localhost/bloglist_test', { family: 4 })

app.use(express.json())
app.use(tokenExtractor)

app.post('/api/blogs', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

const errorHandler = (error, request, response, next) => {
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }

  next(error)
}

app.use(errorHandler)

const api = supertest(app)

let token = null

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash,
  })

  const savedUser = await user.save()

  token = jwt.sign(
    { username: savedUser.username, id: savedUser._id },
    process.env.SECRET
  )
})

test('a blog can be added with a valid token', async () => {
  const newBlog = {
    title: 'Token authentication is useful',
    author: 'Ada Lovelace',
    url: 'https://example.com/token-auth',
    likes: 3,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await Blog.find({})

  assert.strictEqual(blogs.length, 1)
  assert.strictEqual(blogs[0].title, newBlog.title)
})

test('adding a blog fails with status 401 if token is missing', async () => {
  const newBlog = {
    title: 'No token, no blog',
    author: 'Edsger W. Dijkstra',
    url: 'https://example.com/no-token',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogs = await Blog.find({})

  assert.strictEqual(blogs.length, 0)
})

after(async () => {
  await mongoose.connection.close()
})
