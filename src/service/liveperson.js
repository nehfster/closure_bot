const axios = require('axios');
const { get } = require('lodash');
const oAuthHeader = require('../util/oAuthHeader');

const parseParameters = (params) => Object.keys(params).map((element) => {
  if (typeof params[element] === 'string') return `${element}=${params[element]}`;
  if (typeof params[element] === 'object' && params[element].length > 0) {
    return params[element].map((param) => `${element}=${param}`).join('&');
  }
  return '';
}).join('&');


async function lpLoginDomain() {
  try {
    const requestData = await axios({
      method: 'GET',
      url: `http://api.liveperson.net/api/account/${process.env.LP_ACCOUNT}/service/agentVep/baseURI.json?version=1.0`,
    });
    return get(requestData, 'data.baseURI', '');
  } catch (e) {
    return '';
  }
}

async function lpCampaigns(domain) {
  try {
    const params = {
      v: '3.4',
      fields: [
        'id',
        'name',
        'description',
        'startDate',
        'expirationDate',
        'goalId',
        'lobId',
        'status',
        'isDeleted',
        'priority',
        'engagementIds',
        'weight',
        'timeZone',
        'startDateTimeZoneOffset',
        'expirationDateTimeZoneOffset',
        'startTimeInMinutes',
        'expirationTimeInMinutes',
        'type',
      ],
    };
    const url = `https://${domain}/api/account/${process.env.LP_ACCOUNT}/configuration/le-campaigns/campaigns?${parseParameters(params)}`;
    const method = 'get';

    const requestData = await axios({
      method,
      url,
      headers: {
        ...oAuthHeader({ url, method }, true),
      },
    });
    return get(requestData, 'data', {});
  } catch (e) {
    return {};
  }
}

async function lpCampaignConfig(domain, campaign) {
  try {
    const params = {
      v: '3.4',
    };
    const url = `https://${domain}/api/account/${process.env.LP_ACCOUNT}/configuration/le-campaigns/campaigns/${campaign}?${parseParameters(params)}`;
    const method = 'get';

    const requestData = await axios({
      method,
      url,
      headers: {
        ...oAuthHeader({ url, method }, true),
      },
    });
    return {
      campaignConfig: get(requestData, 'data', []),
      revision: get(requestData, 'headers.ac-revision', {}),
    };
  } catch (e) {
    return [];
  }
}

async function setLpCampaignConfig(domain, campaign, config, revision) {
  try {
    const params = {
      v: '3.4',
    };
    const url = `https://${domain}/api/account/${process.env.LP_ACCOUNT}/configuration/le-campaigns/campaigns/${campaign}?${parseParameters(params)}`;
    const method = 'post';
    const requestData = await axios({
      method,
      url,
      headers: {
        ...oAuthHeader({ url, method }, true),
        'x-http-method-override': 'PUT',
        'if-match': revision.toString(),
      },
      data: {
        ...config,
      },
    });
    return get(requestData, 'data', {});
  } catch (e) {
    console.log("TCL: setLpCampaignConfig -> e", e.response)
    return {
      error: true,
      msg: e.response.data,
    };
  }
}


async function lpSkills(domain) {
  try {
    const url = `https://${domain}/api/account/${process.env.LP_ACCOUNT}/configuration/le-users/skills`;
    const method = 'get';

    const requestData = await axios({
      headers: {
        ...oAuthHeader({ url, method }),
      },
      method,
      url,
    });
    return get(requestData, 'data', {});
  } catch (e) {
    return {
      error: true,
      msg: get(e, 'response.data', 'Failed to update user profile'),
    };
  }
}

async function getLpDomains() {
  try {
    const url = `http://api.liveperson.net/api/account/${process.env.LP_ACCOUNT}/service/baseURI.json`;
    const method = 'get';

    const requestData = await axios({
      method,
      url,
      params: {
        version: '1.0',
      },
    });
    return get(requestData, 'data.baseURIs', []);
  } catch (e) {
    return [];
  }
}

async function getLpQueue(domain) {
  try {
    const url = `https://${domain}/operations/api/account/${process.env.LP_ACCOUNT}/msgqueuehealth/current?v=1`;
    const method = 'get';

    const requestData = await axios({
      headers: {
        ...oAuthHeader({ url, method }),
      },
      method,
      url,
    });

    const currentQueue = get(requestData, 'data', []);
    return currentQueue;
  } catch (e) {
    console.log(e);
    return [];
  }
}

async function getLpUsers(domain) {
  try {
    const url = `https://${domain}/api/account/${process.env.LP_ACCOUNT}/configuration/le-users/users`;
    const method = 'get';

    const requestData = await axios({
      headers: {
        ...oAuthHeader({ url, method }),
      },
      method,
      url,
    });
    return get(requestData, 'data', []);
  } catch (e) {
    console.log(e.message);
    return [];
  }
}

async function getLpUser(domain, userId) {
  try {
    const url = `https://${domain}/api/account/${process.env.LP_ACCOUNT}/configuration/le-users/users/${userId}`;
    const method = 'get';

    const requestData = await axios({
      headers: {
        ...oAuthHeader({ url, method }),
      },
      method,
      url,
    });

    return {
      userProfile: get(requestData, 'data', {}),
      revision: get(requestData, 'headers.etag', {}),
    };
  } catch (e) {
    console.log(e.message);
    return [];
  }
}


async function putLpUser(domain, userId, config, revision) {
  try {
    const params = {
      v: '4.0',
    };
    const url = `https://${domain}/api/account/${process.env.LP_ACCOUNT}/configuration/le-users/users/${userId}?${parseParameters(params)}`;
    const method = 'post';
    const requestData = await axios({
      method,
      url,
      headers: {
        ...oAuthHeader({ url, method }, true),
        'x-http-method-override': 'PUT',
        'if-match': revision.toString(),
      },
      data: {
        ...config,
      },
    });
    return get(requestData, 'data', {});
  } catch (e) {
    return {
      error: true,
      msg: get(e, 'response.data', 'Failed to update user profile'),
    };
  }
}

module.exports = {
  lpLoginDomain,
  lpCampaigns,
  lpCampaignConfig,
  setLpCampaignConfig,
  lpSkills,
  getLpDomains,
  getLpQueue,
  getLpUsers,
  getLpUser,
  putLpUser
};
