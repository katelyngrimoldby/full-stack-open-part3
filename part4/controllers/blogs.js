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