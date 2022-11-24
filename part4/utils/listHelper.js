const _ = require('lodash');

const dummy = (blogs) => {
  console.log(blogs);
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  } else if (blogs.length === 1) {
    return blogs[0].likes;
  } else {
    const likes = blogs.reduce((sum, blog) => sum + blog.likes, 0);

    return likes;
  }
};

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  } else if (blogs.length === 1) {
    return {
      title: blogs[0].title,
      author: blogs[0].author,
      likes: blogs[0].likes
    };
  } else {
    const blog = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current);

    return {
      title: blog.title,
      author: blog.author,
      likes: blog.likes
    };
  }
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  } else if (blogs.length === 1) {
    return {
      author: blogs[0].author,
      blogs: 1
    };
  } else {
    const blogsPerAuthor = _.groupBy(blogs, function (blog) {
      return blog.author;
    });

    const topAuthorBlogs = _.reduce(blogsPerAuthor, function(prev, current) {
      return (prev.length > current.length) ? prev : current;
    });

    return {
      author: topAuthorBlogs[0].author,
      blogs: topAuthorBlogs.length
    };
  }
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  } else if (blogs.length === 1) {
    return {
      author: blogs[0].author,
      likes: blogs[0].likes
    };
  } else {
    const blogsPerAuthor = _.groupBy(blogs, function (blog) {
      return blog.author;
    });

    const likesPerAuthor = _.map(blogsPerAuthor, function (blogs) {
      console.log(blogs);
      return {
        author: blogs[0].author,
        likes: blogs.reduce((sum, blog) => sum + blog.likes, 0)
      };
    });

    const topAuthor = likesPerAuthor.reduce((prev, current) => (prev.likes > current.likes) ? prev : current);

    return topAuthor;
  }
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
};