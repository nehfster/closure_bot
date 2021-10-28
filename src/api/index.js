const alive = require('./health/alive');
const login = require('./user/login');
const settings = require('./config/settings');
const hoop = require('./status/hoop');

module.exports = {
  alive,
  ...login,
  ...settings,
  ...hoop,
};