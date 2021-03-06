const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.json(Blog.format(blog));
    } else {
      res.status(404).end();
    }
  } catch (exception) {
    res.status(400).send({ error: 'malformatted id' });
  }
});

blogsRouter.post('/', async (req, res) => {
  const body = req.body;
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);

    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }

    if (body.title === undefined || body.url === undefined) {
      return res.status(400).json({ error: 'title missing or url missing' });
    }

    const user = await User.findById(decodedToken.id);

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
    if (exception.name === 'JsonWebTokenError') {
      res.status(401).json({ error: exception.message });
    } else {
      console.log(exception);
      res.status(500).json({ error: 'something went wrong...' });
    }
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
    const decodedToken = jwt.verify(req.token, process.env.SECRET);

    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }

    const user = await User.findById(decodedToken.id);
    const blog = await Blog.findById(req.params.id);
    // console.log('USER', user);
    // console.log('BLOG', blog);
    if (blog.user !== undefined) {
      if (user._id.toString() === blog.user.toString()) {
        await Blog.findByIdAndRemove(req.params.id);
        res.status(204).end();
      } else {
        res.status(403).end();
      }
    } else {
      await Blog.findByIdAndRemove(req.params.id);
      res.status(204).end();
    }
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError') {
      res.status(401).json({ error: exception.message });
    } else {
      console.log(exception);
      res.status(400).send({ error: 'malformatted id' });
    }
  }
});

module.exports = blogsRouter;
