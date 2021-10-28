const moment = require('moment-timezone');
/**
 * 
 * @param {string} openTime format 00:00:00
 * @param {string} closeTime format 00:00:00
 */
const isWorkingHours = (openTime, closeTime) => {
  const currentTimeFormatted = moment().tz('America/Los_Angeles').format('HH:mm:ss');
  // console.log("isWorkingHours -> currentTimeFormatted", currentTimeFormatted)
  // console.log("isWorkingHours -> openTime", moment(openTime, 'hh:mm:ss').subtract(3, 'seconds').format('HH:mm:ss'))
  // console.log("isWorkingHours -> closeTime",moment(closeTime, 'hh:mm:ss').format('HH:mm:ss'))
  // const fakeTimeForTesting = '21:00:00';
  return moment(currentTimeFormatted, 'hh:mm:ss').isBetween(
    moment(openTime, 'hh:mm:ss').subtract(3, 'seconds'),
    moment(closeTime, 'hh:mm:ss')
  );
};

module.exports = isWorkingHours;