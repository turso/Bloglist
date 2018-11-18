const tokenExtractor = (req, next) => {
  const authorization = req.get('authorization');
  console.log('AUTHORIZATION ON', authorization);
  // console.log('TYPE OF', typeof request.next);
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  }
  next();
};

module.exports = {
  tokenExtractor
};
