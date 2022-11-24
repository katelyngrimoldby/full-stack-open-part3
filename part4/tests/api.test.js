const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./testHelper');

const api= supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  for(let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test('all blogs are returned in JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

afterAll(() => {
  mongoose.connection.close();
});

test('id property is "id"', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body[0].id).toBeDefined();
});

test('POST req adds blog', async () => {
  const blog = { title: 'test', author: 'John Doe', url: 'dummy.com/lorem', likes: 3 };

  const response = await api.post('/api/blogs').send(blog);

  expect(response.body).toEqual(expect.objectContaining(blog));

  const blogs = await helper.blogsInDB();

  expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
});