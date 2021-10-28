const app = async () => {
  try {
    let agent = require('./util/agent');
    const {
      connect,
      error,
      closed,
      exConversationChangeNotification,
      //routingTaskNotification,
    } = require('./events');
    agent.on('connected', connect);
    agent.on('error', error);
    agent.on('closed', closed);
    agent.on('cqm.ExConversationChangeNotification', exConversationChangeNotification);
    // agent.on('routing.RoutingTaskNotification', routingTaskNotification);
  } catch (e) {
    console.log("app -> e", e)
  }
}

module.exports = app;