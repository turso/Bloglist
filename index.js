const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const Blog = mongoose.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
});

module.exports = Blog;

app.use(cors());
app.use(bodyParser.json());

app.use(morgan(':method :url :res :status :response-time[4]'));

morgan.token('res', function(res) {
  return JSON.stringify(res.body);
});

const mongoUrl = 'mongodb://blogger:bl0gg3r1@ds155823.mlab.com:55823/fullstackopen-blog-dev';
mongoose.connect(mongoUrl);

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs);
  });
});

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then(result => {
    response.status(201).json(result);
  });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
