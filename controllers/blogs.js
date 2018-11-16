const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  try {
    const body = req.body;

    if (body.title === undefined || body.url === undefined) {
      return res.status(400).json({ error: 'title missing' });
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes
    });

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
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
