const tokenExtractor = (req, next) => {
  // console.log('GET TOKEN FUNKTION REQ.GET', request.get);
  const authorization = req.get('authorization');
  console.log('AUTHORIZATION ON', authorization);
  // console.log('TYPE OF', typeof request.next);
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    // res.send(authorization.substring(7));
    req.token = authorization.substring(7);
  }
  next();
};

module.exports = {
  tokenExtractor
};
