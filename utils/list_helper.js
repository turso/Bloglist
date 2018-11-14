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
  // let acc = blogs.reduce((acc, val) => acc.set(val, 1 + (acc.get(val) || 0)), [new Map()]);

  return blogs;
};

const mostLikes = blogs => {
  return blogs;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
