const dummy = blogs => {
  blogs = 1;
  return blogs;
};

const totalLikes = blogs => {
  return blogs.length === 0 ? 0 : blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

module.exports = {
  dummy,
  totalLikes
};
