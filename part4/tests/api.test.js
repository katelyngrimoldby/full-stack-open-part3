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

test('Likes set to 0 if undefined in request body', async () => {
  const blog = { title: 'test', author: 'John Doe', url: 'dummy.com/lorem' };

  const response = await api.post('/api/blogs').send(blog);

  expect(response.body).toEqual(expect.objectContaining({ likes: 0 }));
});

test('Error thrown if title, author, and/or url are undefined in request body', async () => {
  const blog = { likes: 1 };

  await api
    .post('/api/blogs')
    .send(blog)
    .expect(400);

  const response = await helper.blogsInDB();

  expect(response).toHaveLength(helper.initialBlogs.length);
});

afterAll(() => {
  mongoose.connection.close();
});