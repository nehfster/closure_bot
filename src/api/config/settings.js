const pool = require('../../service/database');
const _query = require('../../service/query/_query');
const { get, has } = require('lodash');
const { notifyChannel } = require('../../service/slack');
const ApiError = require('../../util/ApiError');
const { updateData } = require('../../config/_data');
const moment = require('moment');

const settings = async (req, res, next) => {
  try {
    const configuration = get(await pool.query(_query.selectConfig), '[0][0].configuration', {})
    res.json(configuration);
  } catch (e) {
    next(e);
  }
};

const postSettings = async (req, res, next) => {
  try {
    const { body } = req;
    const { closureSkills } = body;

    closureSkills.forEach((cs, index) => {
      if (!moment(`2000-12-12 ${cs.hoop.open}`, 'YYYY-MM-DD HH:mm:ss', true).isValid()) throw new ApiError(400, `hoop.open wrong format on config ${index}`);
      if (!moment(`2000-12-12 ${cs.hoop.close}`, 'YYYY-MM-DD HH:mm:ss', true).isValid()) throw new ApiError(400, `hoop.close wrong format on config ${index}`);
    });

    const config = {
      configuration: JSON.stringify(body),
    }

    const updateConfig = await pool.query(_query.addNewConfig, [config]);
    if (!has(updateConfig, '[0]affectedRows')) throw new ApiError(400, 'Failed to update skill');

    updateData(false);

    const successMessage = 'Skill config successfully updated';
    notifyChannel(successMessage)
    res.json({ successMessage });
  } catch (e) {
    next(e);
  }
};


module.exports = {
  settings,
  postSettings,
};