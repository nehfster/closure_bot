const errorHandler = require('./errorHandler');
const auth = require('./authMiddleware');

module.exports = {
  errorHandler,
  auth,
};