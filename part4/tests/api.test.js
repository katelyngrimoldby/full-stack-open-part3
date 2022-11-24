const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./testHelper');

const api= supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  await Blog.insertMany(helper.initialBlogs);
});

describe('Viewing all blogs', () => {
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
});

describe('adding a blog', () => {
  test('POST request adds blog', async () => {
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
});

describe('Deleting a blog', () => {
  test('Blog is removed and deletiong returns 204', async () => {
    const initialBlogs = await helper.blogsInDB();

    await api
      .delete(`/api/blogs/${initialBlogs[0].id}`)
      .expect(204);

    const newBlogs = await helper.blogsInDB();
    expect(newBlogs).toHaveLength(helper.initialBlogs.length - 1);
  });

  test('Returns 404 if blog already deleted', async () => {
    const removedBlogId = await helper.nonExistantBlog();

    await api
      .delete(`/api/blogs/${removedBlogId}`)
      .expect(404);
  });

  test('Returns 400 if invalid id given', async () => {
    await api
      .delete('/api/blogs/kjhgfdsa')
      .expect(400);
  });
});

describe('Updating a blog', () => {
  test('Updates blog with all new fields', async () => {
    const initialBlogs = await helper.blogsInDB();

    const oldFields = {
      title: initialBlogs[0].title,
      author: initialBlogs[0].author,
      url: initialBlogs[0].url,
      likes: initialBlogs[0].likes,
    };

    const newFields = {
      title: 'New Title',
      author: 'New Author',
      url: 'newsite.com',
      likes: 9
    };

    await api.put(`/api/blogs/${initialBlogs[0].id}`).send(newFields);

    const response = await helper.blogsInDB();

    expect(response[0]).not.toEqual(expect.objectContaining(oldFields));
  });

  test('preserves old fields if not replaced', async () => {
    const initialBlogs = await helper.blogsInDB();

    const oldFields = {
      title: initialBlogs[0].title,
      author: initialBlogs[0].author,
      url: initialBlogs[0].url,
    };

    const newFields = {
      likes: 9
    };

    await api.put(`/api/blogs/${initialBlogs[0].id}`).send(newFields);

    const response = await helper.blogsInDB();

    expect(response[0]).toEqual(expect.objectContaining({ ...oldFields, ...newFields }));
  });
});

afterAll(() => {
  mongoose.connection.close();
});