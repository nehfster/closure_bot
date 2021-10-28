const { get } = require('lodash');

const errorHandler = async (err, req, res, next) => {
  let status = get(err, 'status', 500);
  const message = get(err, 'message', 'Critical Failure');
  const errors = get(err, 'errors', 'Unknown');

  if (get(err, 'message', '') === 'jwt expired') status = 401;

  res.status(status).json({
    status,
    message,
    errors,
  });
  next();
};

module.exports = errorHandler;