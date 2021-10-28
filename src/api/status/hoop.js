const { _data } = require('../../config/_data');

const getHoop = async (req, res, next) => {
  try {
    const activeSkills = _data.get('hoopStatus');
    res.json({
      activeSkills: activeSkills
    });
  } catch (e) {
    next(e);
  }
};


module.exports = {
  getHoop,
};