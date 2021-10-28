const ApiError = require('../util/ApiError');
const { errors } = require('./_data');
const jwt = require('jsonwebtoken');

const veryifyJwt = (authorization = '') => {
  if (authorization.startsWith('Bearer ')) {
    const bearer = authorization.split('Bearer ')[1];
    return jwt.verify(bearer, process.env.JWT_SIGN_SECRET);
  }
  return false;
};

const basicAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // Verify JW
    const jwtParsed = veryifyJwt(authorization);
    if (!jwtParsed) throw new ApiError(errors.jwt.INVALID.s, errors.jwt.INVALID.m);

    // JWT Valid
    req.user = jwtParsed;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  basicAuth,
};