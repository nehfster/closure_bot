const _query = {
  selectConfig: `
  SELECT * FROM config
  ORDER BY id DESC
  LIMIT 1;`,
  addNewConfig: `
  INSERT INTO config
  SET ?
  `
}
module.exports = _query;