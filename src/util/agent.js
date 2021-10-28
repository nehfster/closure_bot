const { Agent } = require('node-agent-sdk');

const agent = new Agent({
  accountId: process.env.LP_ACCOUNT,
  username: process.env.LP_USER,
  appKey: process.env.LP_APP_KEY,
  secret: process.env.LP_SECRET,
  accessToken: process.env.LP_ACCESS_TOKEN,
  accessTokenSecret: process.env.LP_TOKEN_SECRET,
});

module.exports = agent;