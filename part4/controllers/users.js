const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 });

  res.json(users);
});

usersRouter.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 });
    if(user) {
      res.json(user);
    } else {
      res.status(404).end();
    }
  } catch(error) {
    next(error);
  }
});

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;
  const existingUser = await User.findOne({ username });

  if(!password) {
    return res.status(400).json({ error: 'password is required' });
  }
  if(password.length < 3) {
    return res.status(400).json({ error: 'password must be at least 3 characters long' });
  }
  if(existingUser) {
    return res.status(400).json({ error: 'username must be unique' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const result = await user.save();

  res.status(201).json(result);
});

module.exports = usersRouter;