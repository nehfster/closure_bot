const { get, isNil, isString } = require('lodash');
const agent = require('../util/agent');
const { _data } = require('../config/_data');
const { closeConversation, sendMessage, transferConversation, joinAgentManager } = require('./actions')
// const jsonfile = require('jsonfile')

const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

const exConversationChangeNotification = async (notificationBody) => {
  const changes = get(notificationBody, 'changes', []);

  for await (const { type = '', result = [] } of changes) {

    // Get conversation ID
    const conversationId = get(result, 'convId', '');

    // Get skillId
    const skillId = get(result, 'conversationDetails.skillId', '');
    //if (skillId === '2093936830') { //Regions: CCenter_GCS_WebMsg
    if (skillId === '3303166430') { //Regions: CCenter_GCS_MobileMsg 
      console.log('found stuck conversation:', conversationId);
      await joinAgentManager(conversationId);
      await delay(100);
      transferConversation(conversationId, '1841764330'); //Regions Handle Closures Bot skill
    }

    // let lastMessage = get(result, 'lastContentEventNotification.event.message', '');

    // // Test last message and assign it as a string
    // if (!isString(lastMessage)) lastMessage = '';

    // // Match the current conversation skill and see if it exists in our config
    // const closureSkill = closureSkills.find((config) => config.skillId === skillId);

    // const isLastMessageFromSelf = get(result, 'lastContentEventNotification.originatorPId', '') === agent.agentId;

    // // If type is upsert and closureskill is not undefined or null then we can continue
    // if (type === 'UPSERT' && !isNil(closureSkill) && !isLastMessageFromSelf && !lastMessage.includes(closureSkill.matchMessage)) {
    //   // console.log(result);
    //   await delay(2000);
    //   await sendMessage(conversationId, closureSkill.message);
    //   await delay(5000);
    //   await closeConversation(conversationId);
    // } else if (lastMessage.includes(closureSkill.matchMessage)) {
    //   await closeConversation(conversationId);
    // }
  }
}

module.exports = exConversationChangeNotification;