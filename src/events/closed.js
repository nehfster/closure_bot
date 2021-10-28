const agent = require('../util/agent');

const closed = async (data) => {
  console.log('socket closed', data);
  clearInterval(agent._pingClock);
  agent.reconnect(); //regenerate token for reasons of authorization (data === 4401 || data === 4407)
}

module.exports = closed;