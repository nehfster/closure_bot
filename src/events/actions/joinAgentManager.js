const agent = require('../../util/agent');

const joinAgentManager = async (dialogId) => new Promise((resolve, reject) => {
    agent.updateConversationField({
      'conversationId': dialogId,
      'conversationField': [
        {
          'field': 'ParticipantsChange',
          'type': 'ADD',
          'role': 'MANAGER'
        }
      ]
    }, (e) => {
      if (e) {
        console.log("transferConversation -> e", e);
        reject(e);
      }
      resolve(true);
    });
});

module.exports = joinAgentManager;