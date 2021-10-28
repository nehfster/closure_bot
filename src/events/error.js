const agent = require('../util/agent');

const error = async (err) => {
  console.log('got an error', err);
}

module.exports = error;