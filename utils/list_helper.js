const dummy = blogs => {
  blogs = 1;
  return blogs;
};

const totalLikes = blogs => {
  return blogs.length === 0 ? 0 : blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = blogs => {
  let likedBlog = blogs.reduce((prev, current) => (prev.likes > current.likes ? prev : current));

  delete likedBlog._id;
  delete likedBlog.url;
  delete likedBlog.__v;

  return likedBlog;
};

const mostBlogs = blogs => {
  const authorBlogCount = blogs.reduce((allBlogs, blog) => {
    if (blog.author in allBlogs) {
      allBlogs[blog.author]++;
    } else {
      allBlogs[blog.author] = 1;
    }
    return allBlogs;
  }, {});

  console.log('AUTHORCOUNT', authorBlogCount);

  return Object.keys(authorBlogCount)
    .map(author => ({ author, blogs: authorBlogCount[author] }))
    .reduce((mostBlogs, author) => ((mostBlogs.blogs || 0) > author.blogs ? mostBlogs : author), {});
};

const mostLikes = blogs => {
  const authorLikesCount = blogs.reduce((blogs, blog) => {
    return {
      ...blogs,
      [blog.author]: (blogs[blog.author] || 0) + blog.likes
    };
  }, {});
  console.log('AuthorCount', authorLikesCount);

  return Object.keys(authorLikesCount)
    .map(author => ({ author, likes: authorLikesCount[author] }))
    .reduce((mostLikes, blog) => ((mostLikes.likes || 0) > blog.likes ? mostLikes : blog), {});
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
