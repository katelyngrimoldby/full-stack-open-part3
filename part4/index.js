const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required field'],
  },
  author: {
    type: String,
    required: [true, 'Author is required field'],
  },
  url: {
    type: String,
    required: [true, 'URL is required field'],
  },
  likes: Number
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  if(error.name === 'ValidationError') {
    return res.status(400).json(error.message);
  }

  next(error);
};

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Blog = mongoose.model('Blog', blogSchema);

// eslint-disable-next-line no-undef
const url = process.env.MONGO_URI;

console.log('connecting to MongoDB');

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch(error => {
    console.log(`Error connecting to MongoDB: ${error.message}`);
  });

app.use(cors());
app.use(express.json());

app.get('/api/blogs', (req, res) => {
  Blog
    .find({})
    .then(blogs => res.json(blogs));
});

app.post('/api/blogs', (req, res, next) => {
  const blog = new Blog(req.body);

  blog.likes = req.body.likes || 0;

  blog
    .save()
    .then(result => res.status(201).json(result))
    .catch(error => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
