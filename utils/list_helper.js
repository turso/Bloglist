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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};
