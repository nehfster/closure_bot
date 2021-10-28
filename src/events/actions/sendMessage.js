const agent = require('../../util/agent');

const sendMessage = async (dialogId, message) => new Promise((resolve, reject) => {
  agent.publishEvent({
    dialogId,
    event: {
      type: 'ContentEvent',
      contentType: 'text/plain',
      message,
    }
  }, (e) => {
    if (e) {
      reject(e);
    }
    resolve(true);
  });
});

module.exports = sendMessage;