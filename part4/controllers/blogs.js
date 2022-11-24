const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});

  res.json(blogs);
});

blogsRouter.post('/', async (req, res, next) => {
  const blog = new Blog(req.body);

  blog.likes = req.body.likes || 0;

  try {
    const result = await blog.save();

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;