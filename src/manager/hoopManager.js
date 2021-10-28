const { getLpDomains, getLpUsers, getLpUser, putLpUser } = require('../service/liveperson');
const { get, has, isUndefined } = require('lodash');
const { _data } = require('../config/_data');
const isWorkingHours = require('../util/isWorkingHours');
const { notifyChannelSkillChange, notifyChannel } = require('../service/slack');

// Store
const lpData = {
  currentUserID: -1,
  userProfile: {},
  revision: {},
  accountConfigReadWrite: ''
}


/* Checks for domain service endpoints in case they change every X ms*/
const refreshProfile = async (recall = true) => {
  try {
    console.log('calling profile refresh');
    // Get service map
    const domains = await getLpDomains();
    lpData.accountConfigReadWrite = get(domains.find(({ service }) => service === 'accountConfigReadWrite'), 'baseURI', '');
    if (!lpData.accountConfigReadWrite) throw new Error('unable to retrive accountConfigReadWrite');

    // Find the current user id
    const users = await getLpUsers(lpData.accountConfigReadWrite);
    const userFound = users.find(({ loginName }) => loginName === process.env.LP_USER)
    if (!userFound) throw new Error('unable to find user');
    lpData.currentUserID = get(userFound, 'id', '');

    // Get user profile
    const { userProfile, revision } = await getLpUser(lpData.accountConfigReadWrite, lpData.currentUserID);
    if (!has(userProfile, 'skills')) throw new Error('unable to find current assigned skills');
    lpData.userProfile = userProfile;
    lpData.revision = revision;

    if (!lpData.currentUserID) throw new Error('unable to find user id within user');

    return true;
  } catch (e) {
    console.log("refreshProfile -> e", e);
    notifyChannel(`<!here> ${e}`);
    return false;
  } finally {
    // Recall itself
    if (recall) setTimeout(refreshProfile, _data.get('configuration').refreshProfileTime || 20000);
  }
};

const skillManager = async () => {
  const { closureSkills } = _data.get('configuration');
  const { accountConfigReadWrite, currentUserID, userProfile, revision } = lpData;

  let currentAssignedSkillsHasChanged = false;
  let currentAssignedSkills = get(userProfile, 'skills', []);

  const slackMessagesToSend = [];

  // If we see our LE user has a skill that doesn't match our config, remove it
  for await (const { id } of currentAssignedSkills) {
    const skillFoundIndex = closureSkills.find((i) => i.skillId === id.toString());

    if (isUndefined(skillFoundIndex)) {
      console.info('ACTION : Unwanted skill found')
      slackMessagesToSend.push(`Unwanted skill removed from list skillId: ${id} :red_flag:`);
      const indexOfSKill = currentAssignedSkills.findIndex(s => s.id === id);
      currentAssignedSkills.splice(indexOfSKill, 1);
      currentAssignedSkillsHasChanged = true;
    }
  }

  // Check Hoop Hours of skills
  for await (const { skillId, skillName, hoop } of closureSkills) {
    const isSkillCurrentlyActive = currentAssignedSkills.find(s => s.id.toString() === skillId);

    // console.log(`isWorkingHours(hoop.open, hoop.close)`, isWorkingHours(hoop.open, hoop.close))
    // If we are during working hours and we see that we belong to the skill, we need to remove ourselves
    if (isWorkingHours(hoop.open, hoop.close) && isSkillCurrentlyActive) {
      console.info('ACTION : isWorkingHours && isSkillCurrentlyActive')
      const indexOfSKill = currentAssignedSkills.findIndex(s => s.id.toString() === skillId);
      currentAssignedSkills.splice(indexOfSKill, 1);
      currentAssignedSkillsHasChanged = true;
      slackMessagesToSend.push(`Removed skillName: ${skillName} skillId: ${skillId} due to in HOOP :no_entry_sign:`);
      continue;
    }

    // If we are outside working hours, we need to add the skill if it doesnt exist
    if (!isWorkingHours(hoop.open, hoop.close) && !isSkillCurrentlyActive) {
      console.info('ACTION : NOT isWorkingHours && NOT isSkillCurrentlyActive')
      currentAssignedSkills.push({
        id: skillId,
        name: skillName,
      })
      slackMessagesToSend.push(`Assigned skillName: ${skillName} skillId: ${skillId} due to out of HOOP :heavy_plus_sign:`);
      currentAssignedSkillsHasChanged = true;
    }
  }

  // We had a change in the skill assignment, lets update the user's profile
  if (currentAssignedSkillsHasChanged) {
    const updatedProfile = {
      ...userProfile,
      skillIds: [
        ...currentAssignedSkills.map(cas => cas.id.toString()),
      ],
    }
    //console.log("updatedProfile", updatedProfile.skillIds)

    try {
      const updateUserRequest = await putLpUser(accountConfigReadWrite, currentUserID, updatedProfile, revision);
      if (!has(updateUserRequest, 'id')) throw new Error('please check skill config as it might be wrong');
      await refreshProfile(false);
      notifyChannelSkillChange(slackMessagesToSend);
    } catch (e) {
      notifyChannel(`<!here> ${e}`);
    }

  }

  _data.set('hoopStatus', currentAssignedSkills);

  setTimeout(skillManager, _data.get('configuration').refreshSkillManager || 5000);

}


const hoopManager = async () => {
  try {
    // Start Services
    await refreshProfile();
    await skillManager();
    // TODO: throw error if skillmanager fails or refresh profile
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

module.exports = hoopManager;