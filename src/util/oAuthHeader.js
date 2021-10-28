const crypto = require('crypto');
const OAuth = require('oauth-1.0a');

const oAuthHeader = (request) => {
  const oauthEncrypt = OAuth({
    consumer: {
      key: process.env.LP_APP_KEY,
      secret: process.env.LP_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64'),
  });

  const token = {
    key: process.env.LP_ACCESS_TOKEN,
    secret: process.env.LP_TOKEN_SECRET,
  };

  return oauthEncrypt.toHeader(oauthEncrypt.authorize(request, { ...token }));
};

module.exports = oAuthHeader;