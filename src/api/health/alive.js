const { name, version, description } = require('../../../package.json');

const alive = async (req, res, next) => {
  try {
    res.json({
      name,
      description,
      version,
      uptime: process.uptime(),
    });
  } catch (e) {
    next(e);
  }
};

module.exports = alive;