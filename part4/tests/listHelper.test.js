const listHelper = require('../utils/listHelper');

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
];

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('Total likes', () => {
  test('Return 0 for empty array', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test('Return likes of one blog', () => {
    const oneBlog = [
      {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
      }
    ];

    const result = listHelper.totalLikes(oneBlog);
    expect(result).toBe(7);
  });

  test('Return sum of likes for multiple blogs', () => {
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(36);
  });
});

describe('favourite blog', () => {
  test('Return null for empty list', () => {
    const blogs = [];

    const result = listHelper.favouriteBlog(blogs);
    expect(result).toBe(null);
  });

  test('Return obj for list with one blog', () => {
    const blog = [
      blogs[0]
    ];

    const result = listHelper.favouriteBlog(blog);
    expect(result).toEqual({
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7
    });
  });

  test('Return blog with most likes', () => {
    const result = listHelper.favouriteBlog(blogs);

    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    });
  });
});

describe('Most blogs', () => {
  test('return null for no blogs', () => {
    const blogs = [];

    const result = listHelper.mostBlogs(blogs);
    expect(result).toBe(null);
  });

  test('Return author and 1 if one blog in list', () => {
    const blog = [
      {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
      },
    ];

    const result = listHelper.mostBlogs(blog);
    expect(result).toEqual({
      author: 'Michael Chan',
      blogs: 1
    });
  });

  test('return top author and total count of blogs', () => {
    const result = listHelper.mostBlogs(blogs);

    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    });
  });
});

describe('Most likes', () => {
  test('return null for no blogs', () => {
    const blogs = [];

    const result = listHelper.mostLikes(blogs);
    expect(result).toBe(null);
  });

  test('Return author and 1 if one blog in list', () => {
    const blog = [
      {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
      },
    ];

    const result = listHelper.mostLikes(blog);
    expect(result).toEqual({
      author: 'Michael Chan',
      likes: 7
    });
  });

  test('return top author and author\'s total likes', () => {
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    });
  });
});