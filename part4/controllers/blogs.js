const blogsRouter = require('express').Router();
const Blog = require('../models/blog');


blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 });

  res.json(blogs);
});

blogsRouter.post('/', async (req, res, next) => {
  const body = req.body;
  try {
    const user = req.user;
    if(user) {
      const blog = new Blog({
        ...body,
        user: user._id
      });
      blog.likes = body.likes || 0;

      const populatedBlog = await blog.populate('user', { name: 1, username: 1 });
      const result = await populatedBlog.save();
      user.blogs = user.blogs.concat(result._id);
      await user.save();

      res.status(201).json(result);
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if(blog) {
      const user = req.user;
      if(user) {
        if(blog.user.toString() === user._id.toString()) {
          await blog.remove();
          res.status(204).end();
        } else {
          return res.status(401).json({ error: 'Invalid authorization' });
        }
      } else {
        return res.status(401).json({ error: 'Invalid authorization' });
      }
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