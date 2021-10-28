const agent = require('../../util/agent');

const closeConversation = async (dialogId) => new Promise((resolve, reject) => {
  agent.updateConversationField({
    conversationId: dialogId,
    conversationField: [{
      field: 'ConversationStateField',
      conversationState: 'CLOSE'
    }]
  }, (e) => {
    if (e) {
      reject(e);
    }
    resolve(true);
  });
});

module.exports = closeConversation;