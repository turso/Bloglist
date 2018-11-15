const supertest = require('supertest');
const { app, server } = require('../index');
const api = supertest(app);
const Blog = require('../models/blog');
const helper = require('./test_helper');

describe('when there is initially some blogs saved', async () => {
  beforeAll(async () => {
    await Blog.deleteMany({});

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));

    await Promise.all(blogObjects.map(b => b.save()));
  });

  test('blogs are returned as json by GET /api/blogs', async () => {
    const blogsInDatabase = await helper.blogsInDb();

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.length).toBe(blogsInDatabase.length);

    const returnedTitles = response.body.map(n => n.title);
    blogsInDatabase.forEach(blog => {
      expect(returnedTitles).toContain(blog.title);
    });
  });

  test('404 returned by GET /api/blog/:id with nonexisting valid id', async () => {
    const validNonexistingId = await helper.nonExistingId();

    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  describe('adding a new blog post', async () => {
    test('POST /api/blogs succeeds with valid data', async () => {
      const blogsAtStart = await helper.blogsInDb();

      const newBlog = {
        title: 'Teuvon Testikirja',
        author: 'Teuvo',
        url: 'www.teuvontestit.com',
        likes: 24
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAfterOperation = await helper.blogsInDb();
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1);

      const titles = blogsAfterOperation.map(blog => blog.title);
      expect(titles).toContain('Teuvon Testikirja');
    });

    test('if blog post hasnt specified like count, the count is set to 0', async () => {
      const blogsAtStart = await helper.blogsInDb();

      const newBlog = {
        title: 'Teuvon Testikirja',
        author: 'Teuvo',
        url: 'www.teuvontestit.com'
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAfterOperation = await helper.blogsInDb();
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1);

      const likes = blogsAfterOperation.map(b => b.likes);
      expect(likes).toContain(0);
    });

    test('if blog post title or url is undefined throw error 400', async () => {
      const blogsAtStart = await helper.blogsInDb();

      const newBlog = {
        author: 'Teuvo',
        likes: 16
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const blogsAfterOperation = await helper.blogsInDb();
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length);
    });
  });

  afterAll(() => {
    server.close();
  });
});
