const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({});
  response.json(users.map(User.format));
});

usersRouter.post('/', async (req, res) => {
  try {
    const body = req.body;
    console.log('BODY', body);

    const existingUser = await User.find({ username: body.username });
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'username must be unique' });
    }

    if (body.password.length <= 3) {
      return res.status(400).json({ error: 'password must be longer than 3 characters' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
      adult: body.adult
    });

    const savedUser = await user.save();

    res.json(savedUser);
  } catch (exception) {
    console.log(exception);
    res.status(500).json({ error: 'something went wrong...' });
  }
});

module.exports = usersRouter;
