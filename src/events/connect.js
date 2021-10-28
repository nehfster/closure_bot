const agent = require('../util/agent');

const connect = async () => {
  console.info('connected...');
  agent.setAgentState({ availability: 'AWAY' });
  agent.subscribeExConversations({
    'convState': ['OPEN'] // subscribes to all open conversation in the account.
  });
  //agent.subscribeRoutingTasks({});
  agent._pingClock = setInterval(agent.getClock, 30000);
}

module.exports = connect;