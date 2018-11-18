const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const middleware = require('./utils/middleware');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const config = require('./utils/config');

app.use(cors());
app.use(bodyParser.json());
app.use(morgan(':method :url :res :status :response-time[4]'));

// const getTokenFrom = (request, next) => {
//   // console.log('GET TOKEN FUNKTION REQ.GET', request.get);
//   const authorization = request.get('authorization');
//   console.log('AUTHORIZATION ON', authorization);
//   console.log('TYPE OF', typeof request.next);
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     // res.send(authorization.substring(7));
//     request.token = authorization.substring(7);
//   }
//   return next();
// };

app.use(middleware.tokenExtractor);

morgan.token('res', function(res) {
  return JSON.stringify(res.body);
});

mongoose
  .connect(config.mongoUrl)
  .then(() => {
    console.log('connected to database', config.mongoUrl);
  })
  .catch(err => {
    console.log(err);
  });

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

server.on('close', () => {
  mongoose.connection.close();
});

module.exports = {
  app,
  server
};
