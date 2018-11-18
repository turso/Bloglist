const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(Blog.format(blog));
    } else {
      response.status(404).end();
    }
  } catch (exception) {
    response.status(400).send({ error: 'malformatted id' });
  }
});

blogsRouter.post('/', async (req, res) => {
  try {
    const body = req.body;

    if (body.title === undefined || body.url === undefined) {
      return res.status(400).json({ error: 'title missing or url missing' });
    }

    const user = await User.findById(body.user);

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    });

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog);
    await user.save();

    res.status(201).json(Blog.format(blog));
  } catch (exception) {
    console.log(exception);
    res.status(500).json({ error: 'something went wrong...' });
  }
});

blogsRouter.put('/:id', async (req, res) => {
  try {
    const blog = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog);

    res.json(Blog.format(updatedBlog));
  } catch (exception) {
    console.log(exception);
    res.status(400).send({ error: 'malformatted id' });
  }
});

blogsRouter.delete('/:id', async (req, res) => {
  try {
    await Blog.findByIdAndRemove(req.params.id);

    res.status(204).end();
  } catch (exception) {
    console.log(exception);
    res.status(400).send({ error: 'malformatted id' });
  }
});

module.exports = blogsRouter;
