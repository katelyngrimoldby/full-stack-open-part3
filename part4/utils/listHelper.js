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

module.exports = {
  dummy,
  totalLikes
};