const { get } = require('lodash');
const bcrypt = require('bcrypt');
const ApiError = require('../../util/ApiError');
const users = require('../mockDB/users');
const jwt = require('jsonwebtoken');

const createToken = (profile, expiresIn = '1d') => {

  const options = {
    expiresIn,
  };

  return jwt.sign(profile, process.env.JWT_SIGN_SECRET, options);
};

const login = async (req, res, next) => {
  try {
    const username = get(req, 'body.username');
    const password = get(req, 'body.password');

    const usersReq = users.find(user => user.username === username);
    if (!usersReq) throw new ApiError(400, 'Cant find user');

    const passwordHashed = get(usersReq, 'password', '');
    const passwordMatch = bcrypt.compareSync(password, passwordHashed);
    if (!passwordMatch) throw new ApiError(400, 'password missmatch');

    const jwt = createToken({
      firstName: get(users, '[0].first_name', ''),
      lastName: get(users, '[0].last_name', ''),
      email: get(users, '[0].email', ''),
    });

    res.json({
      jwt,
    });
  } catch (e) {
    next(e);
  }
};

const botLogin = async (req, res, next) => {
  try {
    const username = get(req, 'body.username');
    const password = get(req, 'body.password');

    const usersReq = users.find(user => user.username === username);
    if (!usersReq) throw new ApiError(400, 'Cant find user');

    const passwordHashed = get(usersReq, 'password', '');
    const passwordMatch = bcrypt.compareSync(password, passwordHashed);
    if (!passwordMatch) throw new ApiError(400, 'password missmatch');

    const jwt = createToken({
      firstName: get(users, '[0].first_name', ''),
      lastName: get(users, '[0].last_name', ''),
      email: get(users, '[0].email', ''),
    },'3650d');

    res.json({
      jwt,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  login,
  botLogin,
};