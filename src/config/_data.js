const { get } = require('lodash');
const nodeCache = require('node-cache');
const pool = require('../service/database');
const _query = require('../service/query/_query');

const _data = new nodeCache();

/* Checks for domain service endpoints in case they change every X ms*/
const updateData = async (recall = true) => {
  console.log("updateData -> recall", recall)
  const configuration = get(await pool.query(_query.selectConfig), '[0][0].configuration', {})
  _data.set('configuration', configuration);
  console.log('updating config')
  if (recall) setTimeout(updateData, 3600000); // Every hour
  if (!recall) console.log('updateData called once');
  return _data;
};



module.exports = { _data, updateData };