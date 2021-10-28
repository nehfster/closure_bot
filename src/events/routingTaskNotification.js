const { get } = require('lodash');
const agent = require('../util/agent');
//const jsonfile = require('jsonfile')

const acceptConversation = async (ring) => {
  const ringId = get(ring, 'ringId', '');
  agent.updateRingState({
    ringId,
    ringState: 'ACCEPTED'
  }, (e, resp) => console.log(resp));

}

const routingTaskNotification = async (notificationBody) => {

  const changes = get(notificationBody, 'changes', []);
  //await jsonfile.writeFileSync(`${__dirname}/debug/routingTaskNotification.json`, changes)

  // Accept any ring waiting
  // changes.forEach((change) => {
  //   const ringsDetails = get(change, 'result.ringsDetails', []);
  //   ringsDetails.forEach((ring) => acceptConversation(ring))
  // })

  //console.log('routingTaskNotification', notificationBody);

}

module.exports = routingTaskNotification;