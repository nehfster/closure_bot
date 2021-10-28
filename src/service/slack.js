const { IncomingWebhook } = require('@slack/webhook');
const url = process.env.SLACK_WEBHOOK_URL;

const webhook = new IncomingWebhook(url);
const sendMessage = process.env.SLACK_SEND_MESSAGE === 'true';

async function notifyChannel(message) {
  try {
    if (sendMessage) {
      await webhook.send({ text: `${process.env.LP_ACCOUNT} ${message}` });
    }
  } catch (e) {
    console.log("notifyChannel -> e", e)
  }
}

async function notifyChannelSkillChange(messages = []) {
  try {
    if (sendMessage) {
      await webhook.send({
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `:arrow_forward: ${process.env.LP_ACCOUNT} : *Skill Assignment Change*`
            }
          },
          {
            "type": "divider"
          },
          ...messages.map(msg => ({
            "type": "section",
            "text": {
              "type": "plain_text",
              "text": msg,
              "emoji": true
            }
          }))
        ]
      });
    }
  } catch (e) {
    console.log("notifyChannel -> e", e)
  }
}


module.exports = {
  notifyChannel,
  notifyChannelSkillChange,
};
