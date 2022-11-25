const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 });

  res.json(blogs);
});

blogsRouter.post('/', async (req, res, next) => {
  const body = req.body;
  const users = await User.find({});

  const blog = new Blog({
    ...body,
    user: users[0]._id
  });

  blog.likes = req.body.likes || 0;

  console.log(blog);
  try {
    const result = await blog.save();
    users[0].blogs = users[0].blogs.concat(result._id);

    const user = new User(users[0]);
    await user.save();

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    const result = await Blog.findByIdAndRemove(req.params.id);
    if(result) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put('/:id', async (req, res, next) => {
  const body = req.body;
  try {
    const blog = await Blog.findById(req.params.id);

    const newBlog = { ...blog['_.doc'], ...body };

    const result = await Blog.findByIdAndUpdate(req.params.id, newBlog, { new: true });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;