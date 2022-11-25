const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  if(error.name === 'ValidationError') {
    return res.status(400).json(error.message);
  }

  if(error.name === 'CastError') {
    return res.status(400).json({ error: 'Malformatted id' });
  }

  if(error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  next(error);
};

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization');
  if(auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.substring(7);
  }
  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
 // tokenExtractor
};