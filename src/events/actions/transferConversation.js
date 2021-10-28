const agent = require('../../util/agent');

const transferConversation = async (dialogId, skill) => new Promise((resolve, reject) => {
  agent.updateConversationField({
    conversationId: dialogId,
    'conversationField': [
      {
        'field': 'ParticipantsChange',
        'type': 'REMOVE',
        'role': 'ASSIGNED_AGENT'
      },
      {
        'field': 'Skill',
        'type': 'UPDATE',
        'skill': skill
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

module.exports = transferConversation;