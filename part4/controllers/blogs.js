const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const config = require('../utils/config');
const jwt = require('jsonwebtoken');

const tokenExtractor = (req) => {
  const auth = req.get('authorization');
  if(auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.substring(7);
  }
  return null;
};


blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 });

  res.json(blogs);
});

blogsRouter.post('/', async (req, res, next) => {
  const body = req.body;
  const token = tokenExtractor(req);
  console.group(token);
  try {
    const decodedToken = jwt.verify(token, config.SECRET);
    console.log('here');
    if(!decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }
    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      ...body,
      user: user._id
    });

    blog.likes = body.likes || 0;

    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
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